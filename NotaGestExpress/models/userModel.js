// Importa o Mongoose
const mongoose = require('mongoose');

// Define o esquema do usuário (estrutura dos dados)
const userSchema = new mongoose.Schema({
    
    // 1. CHAVE DE IDENTIFICAÇÃO (Link para o Serviço de Identidade)
    // Este ID é gerado pelo SEU MICROSSERVIÇO DE IDENTIDADE na hora do cadastro/criação.
    // É a única forma de vincular este perfil de usuário à sua conta de login.
    userId: { 
        type: String, // Tipo que corresponde ao ID gerado pelo Microsserviço de Identidade
        required: true,
        unique: true
    },
    
    // 2. DADOS DO PERFIL (CRUD)
    nome: {
        type: String,
        required: true
    },
    // O email é útil para exibição no perfil, mas a fonte da verdade para login é o outro serviço.
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    
    // 3. REMOÇÃO DA SENHA
    // A SENHA FOI REMOVIDA. Ela está apenas no banco de dados do Microsserviço de Identidade.

    // 4. Campos adicionais (Datas de criação/atualização são sempre úteis)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

// Cria e exporta o modelo 'User' com base no esquema definido
const User = mongoose.model('User', userSchema);

module.exports = User;