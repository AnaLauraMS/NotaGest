// Importa o Mongoose
const mongoose = require('mongoose');

// Define o esquema do usuário (estrutura dos dados)
const userSchema = new mongoose.Schema({
    // Nome do usuário: tipo String e obrigatório
    nome: {
        type: String,
        required: true
    },
    // Email do usuário: tipo String, obrigatório e deve ser único
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Senha do usuário: tipo String e obrigatório
    senha: {
        type: String,
        required: true
    }
});

// Cria e exporta o modelo 'User' com base no esquema definido
const User = mongoose.model('User', userSchema);

module.exports = User;