// controllers/arquivoController.js
const Arquivo = require('../models/arquivosModel');
const User = require('../models/userModel'); // Pode ser útil

// @desc    Buscar todos os arquivos do usuário
// @route   GET /api/arquivos
// @access  Private
exports.getArquivos = async (req, res) => {
    console.log("✅ Rota GET /api/uploads foi acionada!"); // Log para ver se a rota é alcançada
    console.log("Usuário autenticado:", req.user); // Verifique se o ID do usuário está aqui

    try {
        const arquivos = await Arquivo.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        console.log(`Encontrados ${arquivos.length} arquivos para o usuário.`);
        
        res.status(200).json(arquivos);
    } catch (error) {
        console.error("❌ ERRO NO CONTROLLER getArquivos:", error); // Log detalhado do erro
        res.status(500).json({ message: 'Erro interno no servidor ao buscar arquivos', error: error.message });
    }
};

// @desc    Criar um novo arquivo
// @route   POST /api/arquivos
// @access  Private
exports.createArquivo = async (req, res) => {
    try {
        const { title, value, purchaseDate, property, category, subcategory, observation } = req.body;

        const novoArquivo = await Arquivo.create({
            title,
            value,
            purchaseDate,
            property,
            category,
            subcategory,
            observation,
            user: req.user.id // Associando o arquivo ao usuário logado
        });

        res.status(201).json(novoArquivo);
    } catch (error) {
        res.status(400).json({ message: 'Dados inválidos', error: error.message });
    }
};

// @desc    Deletar um arquivo
// @route   DELETE /api/arquivos/:id
// @access  Private
exports.deleteArquivo = async (req, res) => {
    try {
        const arquivo = await Arquivo.findById(req.params.id);

        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        // VERIFICAÇÃO DE SEGURANÇA: Garante que o usuário só pode deletar seus próprios arquivos
        if (arquivo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Não autorizado' });
        }

        await arquivo.deleteOne(); // Usa deleteOne() no documento

        res.status(200).json({ id: req.params.id, message: 'Arquivo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};