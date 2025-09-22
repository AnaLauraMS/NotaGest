// Importa o modelo do usuário
const User = require('../models/userModel');

// Função para buscar dados do dashboard do usuário logado
const getDashboard = async (req, res) => {
    try {
        // O ID do usuário é obtido de req.user (middleware de autenticação)
        const user = await User.findById(req.user).select('-senha');
        
        // Se o usuário não for encontrado, retorna um erro
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        
        // Retorna uma mensagem de boas-vindas com o nome do usuário
        res.json({ message: `Bem-vindo ao seu dashboard, ${user.nome}!` });
    } catch (err) {
        // Trata erros do servidor
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

module.exports = { getDashboard };