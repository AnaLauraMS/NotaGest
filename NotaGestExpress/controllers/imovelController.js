// controllers/imovelController.js
const Imovel = require('../models/imovelModel');

// @desc    Buscar todos os imóveis do usuário
// @route   GET /api/imoveis
// @access  Private
exports.getImoveis = async (req, res) => {
    try {
        // req.user.id vem do middleware 'protect'
        const imoveis = await Imovel.find({ user: req.user.id }).sort({ nome: 1 });
        res.status(200).json(imoveis);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar imóveis', error: error.message });
    }
};

// @desc    Criar um novo imóvel
// @route   POST /api/imoveis
// @access  Private
exports.createImovel = async (req, res) => {
    console.log('🏁🏁🏁 Entrou na função createImovel! 🏁🏁🏁'); 
    console.log('➡️ Requisição POST /api/imoveis recebida com dados:', req.body); 

    try {
        const { nome, cep, rua, numero, bairro, cidade, estado, tipo } = req.body;

        if (!nome) {
            console.error('❌ Erro 400: Campo "nome" faltando.');
            return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
        }

        const novoImovel = await Imovel.create({
            nome, cep, rua, numero, bairro, cidade, estado, tipo,
            user: req.user.id
        });

        console.log('✅ Imóvel criado com sucesso:', novoImovel);
        res.status(201).json(novoImovel);

    } catch (error) {
        // 👇 LOG DETALHADO AQUI 👇
        console.error('❌ ERRO 400 NO CONTROLLER createImovel:');
        
        // Verifica se é um erro de validação do Mongoose
        if (error.name === 'ValidationError') {
            console.error('   Tipo de Erro: Validação do Mongoose');
            // Mongoose coloca os detalhes dos campos inválidos em error.errors
            const errors = Object.values(error.errors).map(el => ({
                campo: el.path,
                mensagem: el.message
            }));
            console.error('   Detalhes dos Campos Inválidos:', errors);
            
            // Retorna uma mensagem mais específica
            return res.status(400).json({ 
                message: 'Dados inválidos ao criar imóvel. Verifique os campos.', 
                validationErrors: errors // Envia os detalhes para o frontend
            });
        } 
        // Verifica se é um erro de "Cast" (ex: ID do usuário mal formatado)
        else if (error.name === 'CastError') {
             console.error('   Tipo de Erro: Erro de Cast (conversão de tipo)');
             console.error(`   Campo: ${error.path}, Valor: ${error.value}`);
             return res.status(400).json({
                 message: `Erro ao converter valor para o campo '${error.path}'. Verifique o formato.`,
                 errorDetails: error.message
             });
        } 
        // Outros tipos de erro (inesperados)
        else {
            console.error('   Tipo de Erro: Desconhecido/Outro');
            console.error('   Mensagem:', error.message);
            console.error('   Stack:', error.stack); // Mostra a pilha de chamadas
             return res.status(500).json({ 
                message: 'Erro interno no servidor ao criar imóvel.', 
                errorDetails: error.message 
            });
        }
    }
};

// @desc    Deletar um imóvel
// @route   DELETE /api/imoveis/:id
// @access  Private
exports.deleteImovel = async (req, res) => {
    try {
        const imovel = await Imovel.findById(req.params.id);

        if (!imovel) {
            return res.status(404).json({ message: 'Imóvel não encontrado.' });
        }

        // VERIFICAÇÃO: Garante que o usuário só pode deletar seus próprios imóveis
        if (imovel.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Ação não autorizada.' }); // 403 Forbidden
        }

        await imovel.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Imóvel removido com sucesso.' });
    } catch (error) {
        console.error("ERRO NO CONTROLLER deleteImovel:", error);
        res.status(500).json({ message: 'Erro no servidor ao deletar imóvel.', error: error.message });
    }
};