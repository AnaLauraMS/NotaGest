// Arquivo: Microsserviço/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb'); // Importa a função de conexão com o MongoDB

const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conexão ao banco de dados MongoDB (Cada microsserviço tem o seu DB)
connectDB(); // Executa a conexão com o banco

const app = express(); // Inicializa a aplicação Express

// Configura o middleware CORS para permitir requisições externas
app.use(cors());
// Configura o Express para parsear o corpo das requisições como JSON
app.use(express.json());

// Rota base para as funcionalidades de Autenticação
// Mapeia todas as rotas de autenticação para o endpoint /api/auth
app.use('/api/auth', authRoutes);

// Define a porta do servidor, usando a variável de ambiente ou 5001 como fallback
const PORT = process.env.PORT || 5001;

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    // Mensagem específica para o microsserviço na porta
    console.log(`Microsserviço de Autenticação rodando na porta ${PORT}`);
});