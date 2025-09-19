const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Importa o middleware de autenticação

// Rota para cadastrar um novo usuário
router.post('/register', userController.registerUser);

// Rota para o login do usuário
router.post('/login', userController.loginUser);

// Rota para ver o perfil do usuário (PROTEGIDA!)
router.get('/profile', auth, userController.getProfile);

// Nova rota para o dashboard (PROTEGIDA!)
router.get('/dashboard', auth, userController.getDashboard);

module.exports = router;