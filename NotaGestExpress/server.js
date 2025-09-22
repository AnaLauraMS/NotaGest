// importação dos módulos necessários
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb');
const userRoutes = require('./routes/userRoutes');

// carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// conexão ao banco de dados MongoDB
connectDB();

// inicializa o aplicativo Express
const app = express();

// middleware-> permite requisições de outras origens (frontend)
app.use(cors());
// middleware-> permite que o Express leia o corpo das requisições em formato JSON
app.use(express.json());

// define a rota base para as funcionalidades de usuário
app.use('/api/users', userRoutes);

// define a porta do servidor, usando a variável de ambiente ou 5000 como padrão
const PORT = process.env.PORT || 5000;

// inicia o servidor e o faz escutar na porta
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});