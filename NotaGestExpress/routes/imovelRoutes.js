// routes/imovelRoutes.js
const express = require('express');
const router = express.Router();
const imovelController = require('../controllers/imovelController'); // Importa as funções de manipulação de imóveis
const { protect } = require('../middleware/auth'); // Importa o middleware de autenticação (JWT)

// Aplica o middleware 'protect' a todas as rotas definidas abaixo.
// Garante que apenas usuários autenticados possam acessar as funcionalidades.
router.use(protect);

// GET /api/imoveis: Rota para buscar e listar todos os imóveis do usuário. (READ)
router.get('/', imovelController.getImoveis);

// POST /api/imoveis: Rota para criar e registrar um novo imóvel. (CREATE)
router.post('/', imovelController.createImovel);

// DELETE /api/imoveis/:id: Rota para remover um imóvel específico pelo seu ID. (DELETE)
router.delete('/:id', imovelController.deleteImovel);

// Exporta o roteador configurado
module.exports = router;