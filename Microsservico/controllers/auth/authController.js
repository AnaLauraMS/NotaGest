// Importação de módulos e modelos necessários
const User = require('../../models/userModel'); // Modelo Mongoose para o usuário (dados de autenticação)
const bcrypt = require('bcryptjs'); // Usado para hashear senhas
const jwt = require('jsonwebtoken'); // Usado para criar e verificar tokens JWT
const axios = require('axios'); // Cliente HTTP para comunicação com outros serviços

require('dotenv').config(); // Carrega as variáveis de ambiente

// Variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET; // Chave secreta para assinatura de tokens
const BACKEND_URL = process.env.BACKEND_URL; // URL base do serviço de backend para comunicação interna

/**
 * @swagger
 * /register:
 * post:
 * tags:
 * - Autenticação
 * summary: Registra um novo usuário e cria um perfil.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/RegisterInput'
 * responses:
 * 201:
 * description: Usuário criado com sucesso e perfil sincronizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/RegisterSuccess'
 * 400:
 * description: Erro de validação ou email já cadastrado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: 'Email já cadastrado.'
 * 500:
 * description: Erro interno do servidor.
 * 503:
 * description: Conta de autenticação criada, mas falha ao sincronizar perfil.
 */

/**
 * @function generateToken
 * @description Função auxiliar para criar um JSON Web Token (JWT).
 * @param {string} id - ID do usuário para inclusão no payload.
 * @param {string} email - Email do usuário para inclusão no payload.
 * @returns {string} O token JWT assinado.
 */
const generateToken = (id, email) => {
    return jwt.sign(
        { id: id, email: email }, 
        JWT_SECRET,
        { expiresIn: '1h' } // Token expira em 1 hora
    );
};

/**
 * @function registerUser
 * @description Função controladora para registrar um novo usuário.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
const registerUser = async (req, res) => {
    // Extrai dados necessários do corpo da requisição
    const { nome, email, senha } = req.body; 
    
    // 1. Validação básica: checa se todos os campos estão presentes
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    try {
        // 2. Verifica se já existe um usuário com o email fornecido
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        
        // 3. Hasheamento da senha antes de salvar no banco de dados
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // Cria e salva o novo registro de autenticação (APENAS email e senha hash)
        const newUser = new User({ email, senha: hashedPassword });
        await newUser.save();
        
        // 4. CHAMADA CRÍTICA: Notifica o Backend principal para criar o perfil de usuário completo
        try {
            await axios.post(`${BACKEND_URL}/internal`, {
                userId: newUser._id.toString(),
                email: newUser.email,
                // Passa o nome original para o backend
                nome: nome 
            });
            
            console.log(`[AUTH SERVICE] Perfil criado com sucesso no Backend para o ID: ${newUser._id}`);
            
        } catch (axiosError) {
            // Loga o erro de comunicação
            console.error(`[AUTH SERVICE] ERRO ao comunicar com o backend:`, axiosError.message);
            
            // Retorna um status que indica que a conta de auth foi criada, mas a sincronização falhou
            return res.status(503).json({ 
                message: 'Conta criada, mas houve um erro ao criar o perfil de usuário. Tente fazer login mais tarde.',
                user: { id: newUser._id, email: newUser.email }
            });
        }
        
        // 5. Retorna sucesso após a criação da conta e do perfil
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: { id: newUser._id.toString(), email: newUser.email }
        });

    } catch (err) {
        // Captura e loga erros de banco de dados ou processamento interno
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};

/**
 * @swagger
 * /login:
 * post:
 * tags:
 * - Autenticação
 * summary: Autentica o usuário e retorna um JSON Web Token (JWT).
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LoginInput'
 * responses:
 * 200:
 * description: Login bem-sucedido e token JWT retornado.
 * headers:
 * x-auth-token:
 * schema:
 * type: string
 * description: Token JWT retornado no corpo da resposta.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LoginSuccess'
 * 400:
 * description: Credenciais inválidas (email ou senha incorretos).
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: 'Credenciais inválidas.'
 * 500:
 * description: Erro interno do servidor.
 */

/**
 * @function loginUser
 * @description Função controladora para realizar o login do usuário.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Procura o usuário no banco de dados de autenticação
        const user = await User.findOne({ email });
        if (!user) {
            // Retorna erro se o usuário não for encontrado
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha fornecida com a senha hasheada no banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            // Retorna erro se as senhas não coincidirem
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Gera o token de autenticação
        const token = generateToken(user._id.toString(), user.email);

        // 4. Retorna a resposta de sucesso com o token
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
        });
        
    } catch (err) {
        // Captura e loga erros de banco de dados ou processamento interno
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

// Exporta as funções controladoras
module.exports = {
    registerUser,
    loginUser,
};