// Importa o modelo do usuário e o bcrypt
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
    // Pega os dados do corpo da requisição
    const { nome, email, senha } = req.body;

    // Valida se todos os campos obrigatórios estão presentes
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o email já está cadastrado
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // Gera um 'salt' e criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria uma nova instância do usuário com a senha criptografada
        const newUser = new User({
            nome,
            email,
            senha: hashedPassword
        });

        // Salva o novo usuário no banco de dados
        await newUser.save();

        // Envia a resposta de sucesso com os dados do usuário
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: {
                id: newUser._id,
                nome: newUser.nome,
                email: newUser.email
            }
        });
    } catch (err) {
        // Trata erros do servidor ou do banco de dados
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};

module.exports = { registerUser };