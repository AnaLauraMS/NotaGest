// Importa o modelo do usuário
const User = require('../../models/userModel');

// Função para buscar o perfil do usuário logado
const getProfile = async (req, res) => {
    try {
        // O ID do usuário é obtido de req.user, que foi populado pelo middleware de autenticação
        const user = await User.findById(req.user).select('-senha');
        
        // Se o usuário não for encontrado (por algum motivo), retorna um erro
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        
        // Retorna os dados do usuário
        res.json(user);
    } catch (err) {
        // Trata erros do servidor
        console.error(err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};

module.exports = { getProfile };