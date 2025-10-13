const express = require('express');
const router = express.Router();

// Importamos apenas o controller responsável por Login/Cadastro.
// Vamos assumir que renomeamos 'registerController' para 'authController'
const authController = require('../controllers/auth/authController'); 

// --- Rotas de Autenticação (PÚBLICAS) ---

// POST /register: Cria uma nova conta de usuário.
router.post('/register', authController.registerUser);

// POST /login: Autentica o usuário e retorna o JWT.
router.post('/login', authController.loginUser);

module.exports = router;
