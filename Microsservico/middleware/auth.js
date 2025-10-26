// Importação de módulos e modelos necessários
const User = require('../../models/userModel'); // Modelo para dados de autenticação (somente email/senha)
const bcrypt = require('bcryptjs'); // Biblioteca para hasheamento de senhas
const jwt = require('jsonwebtoken'); // Para criação e validação de tokens de sessão
const axios = require('axios'); // Usado para comunicação HTTP entre microsserviços

// Carrega as variáveis de ambiente (como segredos e URLs)
require('dotenv').config();

// Variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET; // Chave secreta para assinatura dos tokens
const BACKEND_URL = process.env.BACKEND_URL; // Endpoint do serviço principal para sincronização

/**
 * @function generateToken
 * @description Cria e assina o JSON Web Token (JWT) contendo dados básicos do usuário.
 * @param {string} id - ID único do usuário.
 * @param {string} email - Email do usuário.
 * @returns {string} O token de autenticação.
 */
const generateToken = (id, email) => {
    return jwt.sign(
        { id: id, email: email }, 
        JWT_SECRET,
        { expiresIn: '1h' } // Define a validade do token
    );
};


/**
 * @function registerUser
 * @description Controller para o registro de novos usuários no sistema de autenticação.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
const registerUser = async (req, res) => {
    // Recebe credenciais de autenticação (email, senha) e nome (para o outro serviço)
    const { nome, email, senha } = req.body; 
    
    // Validação básica de entrada
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    try {
        // 1. Verifica a duplicidade do email na base de autenticação
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        
        // 2. Cria o 'salt' e o hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // 3. Persiste o novo usuário no banco de dados de autenticação
        const newUser = new User({ email, senha: hashedPassword });
        await newUser.save();
        
        
        // 4. CHAMADA CRÍTICA: Comunica o serviço de Backend para criar o perfil de usuário
        try {
            await axios.post(`${BACKEND_URL}/internal`, {
                userId: newUser._id.toString(), // Chave de vinculação entre os serviços
                email: newUser.email,
                nome: nome // Envia o nome para ser salvo na outra base de dados
            });
            
            console.log(`[AUTH SERVICE] Perfil criado com sucesso no Backend para o ID: ${newUser._id}`);
            
        } catch (axiosError) {
            // Tratamento de falha na sincronização (Timeout, serviço indisponível, etc.)
            console.error(`[AUTH SERVICE] ERRO ao notificar o Backend!`, axiosError.message);
            
            // Retorna 503 (Serviço Indisponível), alertando que a conta foi criada, mas o perfil não
            return res.status(503).json({ 
                message: 'Conta criada, mas houve um erro ao criar o perfil de usuário. Tente fazer login mais tarde.',
                user: { id: newUser._id, email: newUser.email }
            });
        }
        
        // 5. Retorna sucesso e dados básicos do usuário
        res.status(201).json({
            message: 'Usuário criado com sucesso e perfil sincronizado!',
            user: { id: newUser._id.toString(), email: newUser.email }
        });

    } catch (err) {
        // Tratamento de erros gerais do servidor (Ex: falha no DB)
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};


/**
 * @function loginUser
 * @description Controller para autenticar o usuário e gerar um token de sessão.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Busca o registro de usuário pelo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha informada com o hash armazenado
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Gera o token de acesso para a sessão
        const token = generateToken(user._id.toString(), user.email);

        // 4. Retorna a confirmação e o token de acesso
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
        });
        
    } catch (err) {
        // Tratamento de erros gerais do servidor
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

// Exporta as funções de gerenciamento de usuário
module.exports = {
    registerUser,
    loginUser,
};