const User = require('../../models/userModel');

// Função para buscar todos os usuários
const getAllUsers = async (req, res) => {
    try {
        // Busca todos os usuários na coleção e exclui a senha
        const users = await User.find().select('-senha');
        res.json(users);
    } catch (err) {
        // Trata erros do servidor
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

// Função para buscar um único usuário por ID
const getUserById = async (req, res) => {
    try {
        // Encontra o usuário pelo ID passado nos parâmetros da URL (req.params.id) e exclui a senha
        const user = await User.findById(req.params.id).select('-senha');
        
        // Se o usuário não for encontrado, retorna um erro 404
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        
        // Retorna os dados do usuário encontrado
        res.json(user);
    } catch (err) {
        // Trata erros do servidor
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

module.exports = { getAllUsers, getUserById };