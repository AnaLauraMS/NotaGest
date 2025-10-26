// Importa o pacote Mongoose para gerenciamento do MongoDB
const mongoose = require('mongoose');
// Carrega todas as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Define a função de conexão assíncrona com o banco de dados
const connectDB = async () => {
    try {
        // Tenta conectar usando a URL definida na variável de ambiente
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado com sucesso!');
    } catch (err) {
        // Exibe uma mensagem de erro em caso de falha na conexão
        console.error('Erro de conexão com o MongoDB:', err.message);
        // Encerra o processo com erro
        process.exit(1);
    }
};

// Torna a função de conexão disponível para outros módulos
module.exports = connectDB;