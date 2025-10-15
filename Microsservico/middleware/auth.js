// Importação de módulos e modelos necessários
const User = require('../../models/userModel'); // Seu Model (agora sem 'nome')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Para comunicação com o Backend (NotaGestExpress)

// Adiciona o dotenv para garantir que as variáveis sejam carregadas
require('dotenv').config();

// Variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

// Função para gerar o JWT (reuso de código)
const generateToken = (id, email) => {
    return jwt.sign(
        { id: id, email: email }, 
        JWT_SECRET,
        { expiresIn: '1h' } // Token expira em 1 hora
    );
};


// Func para registrar um novo usuário (CREATE)
const registerUser = async (req, res) => {
    // Agora o Microsserviço de Identidade recebe o 'nome' apenas para criar o perfil no outro serviço.
    const { nome, email, senha } = req.body; 
    
    // Validação básica de entrada
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    try {
        // 1. Verificar se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        
        // 2. Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // 3. Criar e salvar o novo usuário (Apenas email e senha)
        // O Mongoose gerará o _id, que será o nosso userId
        const newUser = new User({ email, senha: hashedPassword });
        await newUser.save();
        
        
        // 4. CHAMADA CRÍTICA: NOTIFICAR O BACKEND PARA CRIAR O PERFIL
        try {
            await axios.post(`${BACKEND_URL}/internal`, {
                userId: newUser._id.toString(), // ID do MongoDB é crucial para o Backend
                email: newUser.email,
                nome: nome // Nome é enviado para o Backend e não salvo neste DB
            });
            
            console.log(`[AUTH SERVICE] Perfil criado com sucesso no Backend para o ID: ${newUser._id}`);
            
        } catch (axiosError) {
            // Em caso de falha de comunicação, é um problema sério de sincronização
            console.error(`[AUTH SERVICE] ERRO ao notificar o Backend!`, axiosError.message);
            
            // Em uma arquitetura mais robusta, aqui você usaria uma fila (Kafka/RabbitMQ) 
            // para tentar o envio novamente (Retry Pattern).
            
            // Por enquanto, apenas avisamos o cliente.
            return res.status(503).json({ 
                message: 'Conta criada, mas houve um erro ao criar o perfil de usuário. Tente fazer login mais tarde.',
                user: { id: newUser._id, email: newUser.email }
            });
        }
        
        // 5. Retornar confirmação
        res.status(201).json({
            message: 'Usuário criado com sucesso e perfil sincronizado!',
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
        // 1. Encontrar o usuário
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 2. Comparar a senha fornecida com o hash salvo
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Gerar o JSON Web Token (JWT)
        const token = generateToken(user._id.toString(), user.email);

        // 4. Retornar o token de acesso
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

// Exportamos SOMENTE as funções de responsabilidade do Auth Service
module.exports = {
    registerUser,
    loginUser,
};