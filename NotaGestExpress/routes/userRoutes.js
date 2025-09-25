// Dentro de Microsservico/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Importa o único controller que agora contém todas as funções
const userController = require('../controllers/auth/registerController'); 

// Rotas de autenticação (Públicas)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rotas Específicas (PROTEGIDAS) - Devem vir primeiro
router.get('/profile', auth, userController.getProfile);
router.get('/dashboard', auth, userController.getDashboard);

// Rotas de leitura (CRUD)
router.get('/', auth, userController.getAllUsers); // /api/users

// Rotas com Parâmetros (Genéricas) - Devem vir por último
router.get('/:id', auth, userController.getUserById);

// Rotas de atualização e deleção (CRUD)
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;