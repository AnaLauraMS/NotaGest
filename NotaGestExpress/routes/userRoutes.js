const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Importa os controllers com as responsabilidades separadas
const registerController = require('../controllers/auth/registerController');
const loginController = require('../controllers/auth/loginController');
const profileController = require('../controllers/auth/profileController');
const dashboardController = require('../controllers/dashboardController');

// Rota para cadastrar um novo usuário
router.post('/register', registerController.registerUser);

// Rota para o login do usuário
router.post('/login', loginController.loginUser);

// Rota para ver o perfil do usuário (PROTEGIDA!)
router.get('/profile', auth, profileController.getProfile);

// Rota para o dashboard (PROTEGIDA!)
router.get('/dashboard', auth, dashboardController.getDashboard);

module.exports = router;