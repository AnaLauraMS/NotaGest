const express = require('express');
const router = express.Router();
// Use o novo controller focado em CRUD de Perfil:
const userController = require('../controllers/userController'); 
const { protect } = require('../middleware/auth'); 


// Rota INTERNA de Criação (Chamada pelo Microsserviço de Identidade)
router.post('/internal', userController.createProfileInternal); 

// Rotas de CRUD PROTEGIDAS
router.get('/:id', protect, userController.getUserProfile);
router.put('/:id', protect, userController.updateUserProfile);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;