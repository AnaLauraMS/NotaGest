// routes/imovelRoutes.js
const express = require('express');
const router = express.Router();
const imovelController = require('../controllers/imovelController');
const { protect } = require('../middleware/auth');

// Protege todas as rotas de imóveis
router.use(protect);

// GET /api/imoveis -> Busca todos os imóveis
router.get('/', imovelController.getImoveis);

// POST /api/imoveis -> Cria um novo imóvel
router.post('/', imovelController.createImovel);

router.delete('/:id', imovelController.deleteImovel);

module.exports = router;