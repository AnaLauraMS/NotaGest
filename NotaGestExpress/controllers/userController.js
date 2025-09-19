const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importa o jsonwebtoken para autenticação JWT

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const newUser = new User({
            nome,
            email,
            senha: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: `Usuário criado com sucesso!` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar usuário." });
    }
};

// Função para fazer o login do usuário
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Verificar se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Credenciais inválidas." });
        }

        // 2. Comparar a senha fornecida com a senha criptografada do banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ error: "Credenciais inválidas." });
        }

        // 3. Gerar um token JWT com o ID do usuário
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Se chegou até aqui, o login foi um sucesso!
        res.status(200).json({
            message: "Login realizado com sucesso!",
            token // Retorna o token para o cliente
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor." });
    }
};

// Função para buscar o perfil do usuário logado
const getProfile = async (req, res) => {
    try {
        // O ID do usuário foi adicionado ao objeto req pelo middleware 'auth'
        const user = await User.findById(req.user).select('-senha'); // .select('-senha') exclui a senha do resultado
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

const getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-senha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.json({ message: `Bem-vindo ao seu dashboard, ${user.nome}!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

module.exports = { registerUser, loginUser, getProfile, getDashboard };
