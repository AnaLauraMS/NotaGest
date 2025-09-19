const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importa o jsonwebtoken para autenticação JWT

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

module.exports = {loginUser};