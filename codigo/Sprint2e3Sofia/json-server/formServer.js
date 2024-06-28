const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname,'assets', 'imgs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // Limite de 5MB para cada arquivo 
});

app.use(express.static(path.join(__dirname, 'public')));

// Middleware do Multer para upload de arquivos (ANTES dos outros middlewares)
app.use(upload.array('inserirImagens', 10), (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Erro de upload do Multer (por exemplo, arquivo muito grande)
        return res.status(400).json({ error: err.message });
    } else if (err) {
        // Outro tipo de erro
        return res.status(500).json({ error: err.message });
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function processFormData(req, res, categoria) {
    try {
        let formData = req.body;
        let files = req.files; 

        // Processar campos de checkbox (dias, temas, local, periodo)
        const checkboxFields = ['dias', 'temas', 'local', 'periodo'];
        checkboxFields.forEach(field => {
            if (formData[field] && !Array.isArray(formData[field])) {
                formData[field] = [formData[field]]; 
            }
        });

        // Formatar dados para o formato desejado
        const formattedData = {
            id: Date.now().toString(), 
            nomeProjeto: formData.nomeProjeto,
            temas: {
                opcoes: (formData.temas || []).map((nome, index) => ({ id: index + 1, nome }))
            },
            local: {
                opcoes: (formData.local || []).map((nome, index) => ({ id: index + 1, nome }))
            },
            // Correção no campo imagem:
            imagem: files && files.length > 0 ? `/assets/imgs/${files[0].filename}` : "",
            resumo: formData.descricao,
            localizacao: formData.localizacao,
            dia: {
                opcoes: (formData.dias || []).map((nome, index) => ({ id: index + 1, nome }))
            },
            horario: formData.horario,
            periodo: {
                opcoes: (formData.periodo || []).map((nome, index) => ({ id: index + 1, nome }))
            }
        };

        // Adicionar informações bancárias apenas para contribuições financeiras
        if (categoria === 'cfinanceira') {
            formattedData.ibancarias = formData.infoBancaria;
        }

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

app.post('/projeto-voluntariado', (req, res) => {
    processFormData(req, res, 'volunt');
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