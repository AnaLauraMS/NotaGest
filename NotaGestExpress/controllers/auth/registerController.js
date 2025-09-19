const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

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

module.exports = {registerUser};