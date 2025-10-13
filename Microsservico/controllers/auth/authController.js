// Importação de módulos e modelos necessários
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Adiciona o dotenv para garantir que o JWT_SECRET seja carregado
require('dotenv').config();

// Func para registrar um novo usuário (CREATE)
const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;
    
    // Validação básica de entrada
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // 1. Verificar se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        
        // 2. Hash da senha (Segurança CRÍTICA)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // 3. Criar e salvar o novo usuário
        const newUser = new User({ nome, email, senha: hashedPassword });
        await newUser.save();
        
        // Retornar confirmação (sem o JWT, pois não é um login)
        res.status(201).json({
            message: 'Usuário criado com sucesso! Por favor, faça login.',
            user: { id: newUser._id, nome: newUser.nome, email: newUser.email }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};

// Func para fazer o login do usuário e gerar o token (AUTHENTICATION)
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Encontrar o usuário
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 2. Comparar a senha fornecida com o hash salvo
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Gerar o JSON Web Token (JWT)
        const token = jwt.sign(
            // Payload (informações básicas que o Core Service precisa)
            { id: user._id, email: user.email }, 
            // Chave Secreta do .env (CRÍTICO: Deve ser a mesma chave no Core Service)
            process.env.JWT_SECRET,
            // Opções (Expiração: 1 hora)
            { expiresIn: '1h' } 
        );

        // 4. Retornar o token de acesso
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            // Opcional: retornar um Refresh Token aqui também se você for implementar
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

// Exportamos SOMENTE as funções de responsabilidade do Auth Service
module.exports = {
    registerUser,
    loginUser,
};
