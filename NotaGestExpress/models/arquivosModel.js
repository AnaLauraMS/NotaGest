const mongoose = require('mongoose');

const arquivoSchema = new mongoose.Schema({
    // Link para o usuário dono do arquivo
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Referência ao seu modelo 'User'
    },
    title: {
        type: String,
        required: [true, 'O título é obrigatório']
    },
    value: {
        type: Number,
        required: [true, 'O valor é obrigatório']
    },
    purchaseDate: {
        type: Date,
        required: [true, 'A data da compra é obrigatória']
    },
    property: {
        type: String,
        required: [true, 'O imóvel é obrigatório']
    },
    category: {
        type: String,
        required: [true, 'A categoria é obrigatória']
    },
    subcategory: {
        type: String,
        required: [true, 'A subcategoria é obrigatória']
    },
    observation: {
        type: String
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Arquivo', arquivoSchema);