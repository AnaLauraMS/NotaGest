const express = require('express');
const router = express.Router();
// Importa o controller responsável pela lógica do perfil do usuário
const userController = require('../controllers/userController'); 
// Importa o middleware de verificação do JWT
const { protect } = require('../middleware/auth'); 


// Rota INTERNA de Criação (Não requer token JWT, mas deve ser protegida no nível de rede)
// POST /api/users/internal: Usada pelo Microsserviço de Identidade para sincronizar um novo perfil.
router.post('/internal', userController.createProfileInternal); 

// --- Rotas de Perfil (CRUD) Protegidas ---

// GET /api/users/:id: Busca os detalhes do perfil do usuário (READ).
// Requer autenticação e verifica se o usuário está acessando o próprio ID.
router.get('/:id', protect, userController.getUserProfile);

// PUT /api/users/:id: Atualiza as informações do perfil. (UPDATE)
// Requer autenticação e verifica se o usuário está atualizando o próprio perfil.
router.put('/:id', protect, userController.updateUserProfile);

// DELETE /api/users/:id: Exclui o perfil do usuário. (DELETE)
// Requer autenticação e verifica a propriedade do perfil.
router.delete('/:id', protect, userController.deleteUser);

// Exporta o roteador configurado
module.exports = router;