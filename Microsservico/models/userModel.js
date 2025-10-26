// userModel.js (Microsserviço de Identidade)

const mongoose = require('mongoose');

// Define o esquema de dados para o modelo de usuário
const userSchema = new mongoose.Schema({
    // Campo de email: obrigatório para login e deve ser único na base
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Campo de senha: obrigatório (armazena o hash da senha)
    senha: {
        type: String,
        required: true
    }
    // O campo 'nome' FOI REMOVIDO para o Backend (NotaGestExpress)
    // Este microsserviço armazena APENAS credenciais de autenticação
});

// Cria o modelo 'User' com base no esquema definido
const User = mongoose.model('User', userSchema);
// Exporta o modelo para ser usado em outras partes da aplicação
module.exports = User;