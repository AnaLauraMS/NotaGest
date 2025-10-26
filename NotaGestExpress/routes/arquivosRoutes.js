const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/arquivosController'); // Importa as funções controladoras de arquivos
const { protect } = require('../middleware/auth'); // Importa o middleware de verificação de autenticação (JWT)

// Aplica o middleware de proteção a todas as rotas definidas neste arquivo.
// O acesso só é permitido se um JWT válido for fornecido.
router.use(protect);

// Rota GET /api/uploads: Busca e lista todos os arquivos do usuário autenticado.
router.get('/', uploadController.getArquivos);

// Rota POST /api/uploads: Processa a criação de um novo registro de arquivo.
router.post('/', uploadController.createArquivo);

// Rota DELETE /api/uploads/:id: Remove um arquivo específico pelo seu ID.
router.delete('/:id', uploadController.deleteArquivo);

// Exporta o objeto 'router' para ser usado na aplicação principal
module.exports = router;