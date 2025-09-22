// Importa os módulos necessários
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para autenticar o usuário e gerar um token JWT
const loginUser = async (req, res) => {
    // Pega o email e a senha do corpo da requisição
    const { email, senha } = req.body;

    try {
        // Busca o usuário no banco de dados pelo email
        const user = await User.findOne({ email });
        // Se o usuário não for encontrado, retorna um erro
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // Compara a senha fornecida com a senha criptografada do banco de dados
        const isMatch = await bcrypt.compare(senha, user.senha);
        // Se as senhas não corresponderem, retorna um erro
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // Gera o token JWT, usando o ID do usuário e a chave secreta
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Envia a resposta de sucesso com o token
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token
        });
    } catch (err) {
        // Trata erros do servidor
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

module.exports = { loginUser };