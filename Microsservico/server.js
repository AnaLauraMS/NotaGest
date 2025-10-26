// Arquivo: Microsserviço/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb'); 
const authRoutes = require('./routes/authRoutes'); 
// 1. Importa a função de configuração do Swagger
const setupSwagger = require('./config/swaggerConfig'); 

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conexão ao banco de dados MongoDB
connectDB(); 

const app = express(); 

// Configura o middleware CORS
app.use(cors());
// Configura o Express para parsear JSON
app.use(express.json());

// 2. Chama a função de configuração do Swagger
setupSwagger(app); // Adiciona a rota /api-docs

// Rota base para as funcionalidades de Autenticação
app.use('/api/auth', authRoutes);

// Define a porta do servidor
const PORT = process.env.PORT || 5001;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Microsserviço de Autenticação rodando na porta ${PORT}`);
    // A mensagem do Swagger aparecerá após esta.
});