const userModel = require("../../models/userModel");
const User = require('../../models/userModel');
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

module.exports = {getProfile};