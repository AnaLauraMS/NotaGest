// importação o Mongoose para interagir com o MongoDB
const mongoose = require('mongoose');
// carrega as variáveis de ambiente
require('dotenv').config();

// função para conectar ao MongoDB
const connectDB = async () => {
    try {
        // utiliza o .env para pegar a URL do MongoDB de conexão
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado com sucesso!');
    } catch (err) {
        // em caso de erro, aparece a mensagem
        console.error('Erro de conexão com o MongoDB:', err.message);
        process.exit(1);
    }
};

// Exporta a função de conexão para ser usada em server.js
module.exports = connectDB;