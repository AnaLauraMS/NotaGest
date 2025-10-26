// controllers/imovelController.js
const Imovel = require('../models/imovelModel'); // Importa o modelo de dados de Imóvel

/**
 * @function getImoveis
 * @description Controller para buscar todos os imóveis pertencentes ao usuário autenticado.
 * @route GET /api/imoveis
 * @access Private
 */
exports.getImoveis = async (req, res) => {
    try {
        // Busca imóveis no DB, filtrando pelo ID do proprietário (obtido do token JWT) e ordenando por nome
        const imoveis = await Imovel.find({ user: req.user.id }).sort({ nome: 1 });
        // Retorna a lista de imóveis com status 200 (OK)
        res.status(200).json(imoveis);
    } catch (error) {
        // Captura e retorna erro interno do servidor
        res.status(500).json({ message: 'Erro no servidor ao buscar imóveis', error: error.message });
    }
};

/**
 * @function createImovel
 * @description Controller para registrar um novo imóvel.
 * @route POST /api/imoveis
 * @access Private
 */
exports.createImovel = async (req, res) => {
    // Logs de rastreio de requisição
    console.log('🏁🏁🏁 Entrou na função createImovel! 🏁🏁🏁'); 
    console.log('➡️ Requisição POST /api/imoveis recebida com dados:', req.body); 

    try {
        // Desestrutura os campos do corpo da requisição
        const { nome, cep, rua, numero, bairro, cidade, estado, tipo } = req.body;

        // Validação de campo obrigatório (nome)
        if (!nome) {
            console.error('❌ Erro 400: Campo "nome" faltando.');
            return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
        }

        // Cria e salva o novo documento no MongoDB
        const novoImovel = await Imovel.create({
            nome, cep, rua, numero, bairro, cidade, estado, tipo,
            user: req.user.id // Associa o imóvel ao usuário logado
        });

        console.log('✅ Imóvel criado com sucesso:', novoImovel);
        // Retorna o objeto criado com status 201 (Created)
        res.status(201).json(novoImovel);

    } catch (error) {
        // 👇 LOG DETALHADO E TRATAMENTO DE ERROS ESPECÍFICOS DO MONGOOSE 👇
        console.error('❌ ERRO 400 NO CONTROLLER createImovel:');
        
        // Verifica se é um erro de validação (campos faltando ou com formato errado no esquema Mongoose)
        if (error.name === 'ValidationError') {
            console.error('   Tipo de Erro: Validação do Mongoose');
            const errors = Object.values(error.errors).map(el => ({
                campo: el.path,
                mensagem: el.message
            }));
            console.error('   Detalhes dos Campos Inválidos:', errors);
            
            // Retorna 400 com detalhes de validação
            return res.status(400).json({ 
                message: 'Dados inválidos ao criar imóvel. Verifique os campos.', 
                validationErrors: errors 
            });
        } 
        // Verifica se houve erro de conversão de tipo (CastError, ex: ID inválido)
        else if (error.name === 'CastError') {
             console.error('   Tipo de Erro: Erro de Cast (conversão de tipo)');
             console.error(`   Campo: ${error.path}, Valor: ${error.value}`);
             return res.status(400).json({
                 message: `Erro ao converter valor para o campo '${error.path}'. Verifique o formato.`,
                 errorDetails: error.message
             });
        } 
        // Outros erros não tratados
        else {
            console.error('   Tipo de Erro: Desconhecido/Outro');
            console.error('   Mensagem:', error.message);
            console.error('   Stack:', error.stack); 
             return res.status(500).json({ 
                message: 'Erro interno no servidor ao criar imóvel.', 
                errorDetails: error.message 
             });
        }
    }
};

/**
 * @function deleteImovel
 * @description Controller para deletar um imóvel específico.
 * @route DELETE /api/imoveis/:id
 * @access Private
 */
exports.deleteImovel = async (req, res) => {
    try {
        // Busca o imóvel pelo ID fornecido na URL
        const imovel = await Imovel.findById(req.params.id);

        // Checa se o imóvel existe
        if (!imovel) {
            return res.status(404).json({ message: 'Imóvel não encontrado.' });
        }

        // VERIFICAÇÃO DE SEGURANÇA: Confirma se o usuário logado é o proprietário
        if (imovel.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Ação não autorizada.' }); // Acesso Negado
        }

        // Deleta o documento do banco de dados
        await imovel.deleteOne();

        // Retorna sucesso na remoção
        res.status(200).json({ id: req.params.id, message: 'Imóvel removido com sucesso.' });
    } catch (error) {
        console.error("ERRO NO CONTROLLER deleteImovel:", error);
        // Trata erros de servidor ou formato de ID
        res.status(500).json({ message: 'Erro no servidor ao deletar imóvel.', error: error.message });
    }
};