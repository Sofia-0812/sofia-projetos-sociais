const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const { createProxyMiddleware } = require('http-proxy-middleware');

// Configurar proxy para Font Awesome
app.use('/fontawesome', createProxyMiddleware({
  target: 'https://kit.fontawesome.com',
  changeOrigin: true,
  pathRewrite: {
    '^/fontawesome': '/'
  }
}));

// Configuração do Multer para armazenamento de imagens
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'assets', 'imagens'),
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // Limite de 5MB por arquivo
});

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

// Middleware para lidar com o upload de imagens
app.use(upload.array('inserirImagens', 10), (err, req, res, next) => {
  if (err) {
    return res.status(err instanceof multer.MulterError ? 400 : 500).json({ error: err.message });
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas para voluntário
app.get('/volunt', (req, res) => {
  const dados = JSON.parse(fs.readFileSync('db.json'));
  res.json(dados.voluntario);
});

app.put('/volunt', (req, res) => {
  const novosDados = req.body;
  const dados = JSON.parse(fs.readFileSync('db.json'));

  for (const campo in novosDados) {
    if (campo !== 'fotoPerfil' || novosDados.fotoPerfil) {
      dados.voluntario[campo] = novosDados[campo];
    }
  }

  if (req.body.fotoPerfil) {
    const base64Data = req.body.fotoPerfil.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    const fileExt = req.body.fotoPerfil.split(';')[0].split('/')[1];
    const fileName = `perfil_${Date.now()}.${fileExt}`;
    fs.writeFileSync(path.join('public', 'img', fileName), base64Data, 'base64');
    dados.voluntario.fotoPerfil = `img/${fileName}`;
  }

  fs.writeFileSync('db.json', JSON.stringify(dados, null, 2));
  res.json({ message: 'Dados atualizados com sucesso!' });
});

// Rotas para cada formulário
app.post('/projeto-voluntariado', (req, res) => {
  processFormData(req, res, 'voluntariado');
});

app.post('/doacao', (req, res) => {
  processFormData(req, res, 'doacoes');
});

app.post('/cfinanceira', (req, res) => {
  processFormData(req, res, 'cfinanceira');
});

// Rota para buscar dados de um usuário específico
app.get('/usuarios', (req, res) => {
  const dados = JSON.parse(fs.readFileSync('db.json'));
  const usuarioId = req.query.id;
  const usuario = dados.usuarios.find(u => u.id === usuarioId);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json(usuario);
});
// Rota para atualizar dados do usuário
app.put('/usuarios/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const novosDados = req.body;
    const dados = JSON.parse(fs.readFileSync('db.json'));

    const usuarioIndex = dados.usuarios.findIndex(u => u.id === userId);
    if (usuarioIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar apenas os campos que foram enviados na requisição
    for (const campo in novosDados) {
      if (novosDados.hasOwnProperty(campo)) {
        dados.usuarios[usuarioIndex][campo] = novosDados[campo];
      }
    }

    // Verificar se a senha foi alterada (apenas se novaSenha e confirmarSenha estiverem presentes)
    if (novosDados.novaSenha && novosDados.confirmarSenha) {
      if (novosDados.novaSenha === novosDados.confirmarSenha) {
        dados.usuarios[usuarioIndex].senha = novosDados.novaSenha; // Atualizar a senha
      } else {
        return res.status(400).json({ error: 'As novas senhas não coincidem.' });
      }
    }

    fs.writeFileSync('db.json', JSON.stringify(dados, null, 2));
    res.json({ message: 'Dados atualizados com sucesso!' }); // Retornar mensagem de sucesso
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para processar os dados dos formulários
function processFormData(req, res, categoria) {
  try {
    let formData = req.body;
    let files = req.files;

    // Processar campos de checkbox
    const checkboxFields = ['dias', 'temas', 'local', 'periodo'];
    checkboxFields.forEach(field => {
      if (formData[field] && !Array.isArray(formData[field])) {
        formData[field] = [formData[field]];
      }
    });
    
    const formattedData = {
      id: Date.now().toString(),
    };

    if (formData.nome) {
      formattedData.nome = formData.nome;
    }
    if (formData.temas) {
      formattedData.temas = {
        opcoes: formData.temas.map(nome => ({ nome })),
      };
    }
    if (files && files.length > 0) {
      formattedData.imagem = `/assets/imagens/${files[0].filename}`;
    }

    // Adicionar o anfitrião ao objeto formatado
    formattedData.anfitriao = formData.anfitriao;

    // Campos específicos por categoria
    switch (categoria) {
      case 'voluntariado':
        formattedData.nome = formData.nome || formData.nomeProjeto;
        formattedData.resumo = formData.descricao;
        formattedData.localizacao = formData.localizacao;
        if (formData.dias) {
          formattedData.dia = { opcoes: formData.dias.map(nome => ({ nome })) };
        }
        formattedData.horario = formData.horario;
        if (formData.periodo) {
          formattedData.periodo = { opcoes: formData.periodo.map(nome => ({ nome })) };
        }
        if (formData.local) {
          formattedData.local = { opcoes: formData.local.map(nome => ({ nome })) };
        }
        break;
      case 'doacoes':
        formattedData.nome = formData.nome || formData.nomeProjeto;
        formattedData.resumo = formData.descricao;
        formattedData.localizacao = formData.localizacao;
        if (formData.dias) {
          formattedData.dia = { opcoes: formData.dias.map(nome => ({ nome })) };
        }
        formattedData.horario = formData.horario;
        if (formData.periodo) {
          formattedData.periodo = { opcoes: formData.periodo.map(nome => ({ nome })) };
        }
        if (formData.local) {
          formattedData.local = { opcoes: formData.local.map(nome => ({ nome })) };
        }
        break;
      case 'cfinanceira':
        formattedData.nome = formData.nome || formData.nomeProjeto;
        formattedData.resumo = formData.descricao;
        formattedData.ibancarias = formData.infoBancaria;
        break;
    }

  
    for (const key in formattedData) {
      if (formattedData[key] === undefined || (Array.isArray(formattedData[key]) && formattedData[key].length === 0)) {
        delete formattedData[key];
      }
    }

    // Salvar no db.json
    const dbFilePath = path.join(__dirname, 'db.json');
    fs.readFile(dbFilePath, (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
      const categoriaParaSalvar = categoria === 'voluntariado' ? 'volunt' : categoria;
      db[categoriaParaSalvar] = db[categoriaParaSalvar] || [];
      db[categoriaParaSalvar].push(formattedData);

      const anfitriaoId = formData.anfitriaoId; // Obtém o nome do anfitrião do formulário

      const anfitriao = db.anfitrioes.find(anfitriao => anfitriao.id === anfitriaoId);//Obtém o anfitriao logado

      // Verifica se já existe o objeto id_meusProjetos para o anfitrião
      if (!anfitriao.id_meusProjetos) {
        // Se não existe, cria um array vazio para armazenar os ids dos projetos
        anfitriao.id_meusProjetos = [];
      }
      
      // Adiciona o id do projeto recém-criado ao array id_meusProjetos do anfitrião
      anfitriao.id_meusProjetos.push(formattedData.id);
      
      fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), (err) => {
        if (err) throw err;
        console.log(`Dados de ${categoria} gravados com sucesso!`);
        res.status(200).send(`Dados de ${categoria} enviados com sucesso!`);
      });
    });
  } catch (error) {
    console.error(`Erro ao processar solicitação de ${categoria}:`, error);
    res.status(500).send(`Erro interno do servidor: ${error.message}`);
  }
}

// Rota para login
app.post('/login', (req, res) => {
  try {
    const { email, senha } = req.body;
    const dados = JSON.parse(fs.readFileSync('db.json'));

    // Procurar o usuário pelo email
    const usuario = dados.usuarios.find(u => u.email === email);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar a senha
    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Login bem-sucedido
    res.json({ message: 'Login bem-sucedido', usuario });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/cadastro', (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const dados = JSON.parse(fs.readFileSync('db.json'));

    if (dados.usuarios.some(u => u.email === email)) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const novoId = Math.random().toString(36).substr(2, 5); 

    const novoUsuario = {
      id: novoId,
      nome,
      email,
      senha
    };

    dados.usuarios.push(novoUsuario);

    fs.writeFileSync('db.json', JSON.stringify(dados, null, 2));

    res.json({ message: 'Cadastro realizado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao realizar cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/anfitrioes', (req, res) => {
  const dados = JSON.parse(fs.readFileSync('db.json'));
  const anfitriaoId = req.query.id;
  const anfitriao = dados.anfitrioes.find(a => a.id === anfitriaoId);

  if (!anfitriao) {
    return res.status(404).json({ error: 'Anfitrião não encontrado' });
  }

  res.json(anfitriao);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});