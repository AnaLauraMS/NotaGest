const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Importa o único controller que agora contém todas as funções
const userController = require('../controllers/auth/registerController'); 

// Rotas de autenticação
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rotas de leitura (CRUD)
router.get('/', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getProfile);
router.get('/:id', auth, userController.getUserById);

// Rotas de atualização e deleção (CRUD)
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

// Rota do dashboard
router.get('/dashboard', auth, userController.getDashboard);

module.exports = router;