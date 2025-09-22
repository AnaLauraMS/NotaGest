// Importa o Express e o roteador
const express = require('express');
const router = express.Router();
// Importa o middleware de autenticação
const auth = require('../middleware/auth');

// Importa os controllers com as responsabilidades separadas
const registerController = require('../controllers/auth/registerController');
const loginController = require('../controllers/auth/loginController');
const readController = require('../controllers/auth/readController');
const dashboardController = require('../controllers/dashboardController');

// Rota POST para cadastrar um novo usuário
router.post('/register', registerController.registerUser);

// Rota POST para fazer o login do usuário
router.post('/login', loginController.loginUser);

// Rota GET para buscar todos os usuários (rota protegida)
router.get('/', auth, readController.getAllUsers);

// Rota GET para buscar um único usuário por ID (rota protegida)
router.get('/:id', auth, readController.getUserById);

// Rota GET para buscar o perfil do usuário logado (rota protegida)
// Reutiliza a função de busca por ID
router.get('/profile', auth, async (req, res) => {
    // O ID do usuário autenticado é pego do token e colocado em req.user pelo middleware 'auth'
    req.params.id = req.user;
    await readController.getUserById(req, res);
});

// Rota GET para o dashboard (rota protegida)
router.get('/dashboard', auth, dashboardController.getDashboard);

// Exporta o roteador
module.exports = router;