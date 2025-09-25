const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb'); // O Microsserviço conecta o DB
const userRoutes = require('./routes/userRoutes'); // Rotas de CRUD

dotenv.config();

// conexão ao banco de dados MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// rota base para as funcionalidades de usuário
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    // Mensagem específica para o microsserviço na porta
    console.log(`Microsserviço de Autenticação rodando na porta ${PORT}`);
});