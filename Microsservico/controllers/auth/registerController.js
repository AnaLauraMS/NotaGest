// importação de todos os módulos e modelos necessários
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Func para registrar um novo usuário
const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        const newUser = new User({ nome, email, senha: hashedPassword });
        await newUser.save();
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: { id: newUser._id, nome: newUser.nome, email: newUser.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};

// func para fazer o login do usuário
const loginUser = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

// func para buscar todos os usuários
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-senha');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

// func para buscar um único usuário por ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-senha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

// func para atualizar um usuário por ID
const updateUser = async (req, res) => {
    try {
        console.log("Dados recebido para a atualização:", req.body);
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-senha');
        if (!updatedUser) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.json({
            message: 'Usuário atualizado com sucesso!',
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

// func para deletar um usuário por ID
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.json({ msg: 'Usuário removido com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

// func para buscar o perfil do usuário logado (usando o ID do token)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-senha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

// func para buscar dados do dashboard do usuário logado
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


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getProfile,
    getDashboard,
};