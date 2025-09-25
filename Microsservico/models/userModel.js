// importação do Mongoose
const mongoose = require('mongoose');

// definição do esquema do usuário no MongoDB
const userSchema = new mongoose.Schema({
    // nome do usuário: obrigatório e string
    nome: {
        type: String,
        required: true
    },
    // email do usuário: obrigatório e deve ser único e string
    email: {
        type: String,
        required: true,
        unique: true
    },
    // senha do usuário: obrigatório e string
    senha: {
        type: String,
        required: true
    }
});

// criação e exportação do modelo 'User' com base no esquema definido
const User = mongoose.model('User', userSchema);

module.exports = User;