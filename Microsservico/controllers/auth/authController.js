// Importação de módulos e modelos necessários
const User = require('../../models/userModel'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 

require('dotenv').config();

// Variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

// Função auxiliar para geração de token
const generateToken = (id, email) => {
    return jwt.sign(
        { id: id, email: email }, 
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Func para registrar um novo usuário (CREATE)
const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body; 
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // O Model do Auth Service salva APENAS email e senha
        const newUser = new User({ email, senha: hashedPassword });
        await newUser.save();
        
        // 4. CHAMADA CRÍTICA: NOTIFICAR O BACKEND PARA CRIAR O PERFIL
        try {
            await axios.post(`${BACKEND_URL}/internal`, {
                userId: newUser._id.toString(),
                email: newUser.email,
                nome: nome // <<-- CORREÇÃO: Usa a variável 'nome' do req.body original
            });
            
            console.log(`[AUTH SERVICE] Perfil criado com sucesso no Backend para o ID: ${newUser._id}`);
            
        } catch (axiosError) {
            console.error(`[AUTH SERVICE] ERRO ao comunicar com o backend:`, axiosError.message);
            
            // Retorna 503, pois a conta existe mas o perfil não foi sincronizado
            return res.status(503).json({ 
                message: 'Conta criada, mas houve um erro ao criar o perfil de usuário. Tente fazer login mais tarde.',
                user: { id: newUser._id, email: newUser.email }
            });
        }
        
        // 5. Retornar confirmação
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: { id: newUser._id.toString(), email: newUser.email }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};

// Func para fazer o login do usuário e gerar o token (AUTHENTICATION)
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

        const token = generateToken(user._id.toString(), user.email);

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};