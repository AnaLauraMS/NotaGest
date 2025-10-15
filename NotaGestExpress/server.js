// importação dos módulos necessários
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb');
const userRoutes = require('./routes/userRoutes');

// 1. CARREGA AS VARIÁVEIS DE AMBIENTE (ISSO DEVE VIR PRIMEIRO)
dotenv.config();

// 2. INICIALIZA O APLICATIVO EXPRESS
const app = express();

// 3. CONEXÃO AO BANCO DE DADOS MONGODB (APÓS O dotenv.config)
// Se houver erro, a aplicação para aqui.
connectDB(); 

// middleware-> permite requisições de outras origens (frontend)
app.use(cors());
// middleware-> permite que o Express leia o corpo das requisições em formato JSON
app.use(express.json());

// define a rota base para as funcionalidades de usuário
// ATENÇÃO: A URL de teste agora é: /api/users/<ID>
app.use('/api/users', userRoutes);

// define a porta do servidor, usando a variável de ambiente ou 5000 como padrão
const PORT = process.env.PORT || 5000;

// inicia o servidor e o faz escutar na porta
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});