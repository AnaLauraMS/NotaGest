const User = require('../models/userModel');

// Função para buscar dados do dashboard do usuário logado
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

module.exports = { getDashboard };