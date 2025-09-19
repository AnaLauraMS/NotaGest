//ponto de entrada no back, configura o servidor e a rota do cliente
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb'); // Importa a conexão com o MongoDB
const userRoutes = require('./routes/userRoutes');

dotenv.config();

// Conecta ao banco de dados MongoDB
connectDB();

const app = express();

app.use(cors()); //permissão que o front acesse o backend
app.use(express.json()); //no corpo da requisição permitimos JSON

app.use('/api/users', userRoutes); //rota base para os se cadastrarem clientes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Subiu, graças a DEUS! ${PORT}`);
});