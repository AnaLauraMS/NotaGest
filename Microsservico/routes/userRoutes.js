// Dentro de Microsservico/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/auth/registerController'); 

// Rotas de Autenticação (Públicas)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rotas Protegidas de CRUD
router.get('/', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getProfile);
router.get('/dashboard', auth, userController.getDashboard);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;