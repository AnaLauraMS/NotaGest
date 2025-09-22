// Importa o modelo do usuário e o bcrypt
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Função de serviço para registrar um novo usuário
const registerUser = async (nome, email, senha) => {
    // 1. Verifica se o email já está cadastrado
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('Email já cadastrado.');
    }

    // 2. Gera um 'salt' e criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // 3. Cria uma nova instância do usuário com a senha criptografada
    const newUser = new User({
        nome,
        email,
        senha: hashedPassword
    });

    // 4. Salva o novo usuário no banco de dados
    await newUser.save();

    // 5. Retorna o novo usuário criado
    return newUser;
};

// Exporta a função
module.exports = { registerUser };