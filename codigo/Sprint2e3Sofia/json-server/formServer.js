const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

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

app.use(express.static(path.join(__dirname, 'public')));

// Middleware para lidar com o upload de imagens
app.use(upload.array('inserirImagens', 10), (err, req, res, next) => {
  if (err) {
    return res.status(err instanceof multer.MulterError ? 400 : 500).json({ error: err.message });
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function processFormData(req, res, categoria) {
  try {
    let formData = req.body;
    let files = req.files;

    // Processar campos de checkbox
    const checkboxFields = ['dias', 'temas', 'local', 'periodo', 'idosos', 'animais', 'hospitais', 'criancas'];
    checkboxFields.forEach(field => {
      if (formData[field] && !Array.isArray(formData[field])) {
        formData[field] = [formData[field]];
      }
    });

    // Formatar dados
    const formattedData = {
      id: Date.now().toString(),
    };

    // Campos comuns
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

    // Remover campos vazios
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});