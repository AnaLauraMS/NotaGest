// userModel.js (Microsserviço de Identidade)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // email do usuário: obrigatório e deve ser único
    email: {
        type: String,
        required: true,
        unique: true
    },
    // senha do usuário: obrigatório
    senha: {
        type: String,
        required: true
    }
    // O campo 'nome' FOI REMOVIDO para o Backend (NotaGestExpress)
});

const User = mongoose.model('User', userSchema);
module.exports = User;