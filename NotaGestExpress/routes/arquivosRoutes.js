const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/arquivosController'); // Verifique o nome do seu controller
const { protect } = require('../middleware/auth');

// Qualquer rota definida abaixo desta linha agora estará protegida.
router.use(protect);

router.get('/', uploadController.getArquivos);

// Rota para criar um novo arquivo (POST /api/uploads)
router.post('/', uploadController.createArquivo);

// Rota para deletar um arquivo (DELETE /api/uploads/:id)
router.delete('/:id', uploadController.deleteArquivo);

module.exports = router;