// controllers/arquivoController.js
const Arquivo = require('../models/arquivosModel'); // Importa o modelo de dados de arquivo
const User = require('../models/userModel'); // Importa o modelo de usuário (para referência)

/**
 * @function getArquivos
 * @description Controller para buscar todos os arquivos associados ao usuário logado.
 * @route GET /api/arquivos
 * @access Private
 */
exports.getArquivos = async (req, res) => {
    // Log de rastreio de requisição
    console.log("Rota GET /api/uploads foi acionada!"); 
    // Log para depuração do estado de autenticação
    console.log("Usuário autenticado:", req.user); 

    try {
        // Busca arquivos no banco de dados filtrando pelo ID do usuário (req.user.id) e ordenando pela data
        const arquivos = await Arquivo.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        console.log(`Encontrados ${arquivos.length} arquivos para o usuário.`);
        
        // Retorna a lista de arquivos com status 200 (OK)
        res.status(200).json(arquivos);
    } catch (error) {
        // Log detalhado do erro
        console.error("ERRO NO CONTROLLER getArquivos:", error); 
        // Retorna 500 para erro interno do servidor
        res.status(500).json({ message: 'Erro interno no servidor ao buscar arquivos', error: error.message });
    }
};

/**
 * @function createArquivo
 * @description Controller para criar um novo registro de metadados de arquivo.
 * @route POST /api/arquivos
 * @access Private
 */
exports.createArquivo = async (req, res) => {
    console.log('🏁 Entrou createArquivo com dados:', req.body);
    try {
        // Desestrutura os campos do corpo da requisição (incluindo o caminho do arquivo)
        const { title, value, purchaseDate, property, category, subcategory, observation, filePath } = req.body; 

        // Validação básica: checa se os campos essenciais estão presentes
        if (!title || !value || !purchaseDate || !property || !category || !subcategory) {
             return res.status(400).json({ message: 'Campos obrigatórios faltando.'});
        }

        // Cria o novo documento no MongoDB com os dados e o ID do usuário logado
        const novoArquivo = await Arquivo.create({
            title, value, purchaseDate, property, category, subcategory, observation, 
            filePath, // Salva o caminho de acesso ao arquivo (storage)
            user: req.user.id 
        });

        console.log('✅ Arquivo (metadados) criado:', novoArquivo);
        // Retorna o novo arquivo criado com status 201 (Created)
        res.status(201).json(novoArquivo);
    } catch (error) {
        // Captura e retorna erro de validação de dados ou DB
        res.status(400).json({ message: 'Dados inválidos ao criar arquivo.', errorDetails: error.message });
    }
};

/**
 * @function deleteArquivo
 * @description Controller para deletar um arquivo específico.
 * @route DELETE /api/arquivos/:id
 * @access Private
 */
exports.deleteArquivo = async (req, res) => {
    try {
        // Busca o arquivo pelo ID fornecido nos parâmetros da URL
        const arquivo = await Arquivo.findById(req.params.id);

        // Checa se o arquivo existe
        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        // VERIFICAÇÃO DE SEGURANÇA: Garante que o usuário logado é o proprietário do arquivo
        if (arquivo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Não autorizado' });
        }

        // Remove o documento do banco de dados
        await arquivo.deleteOne(); 

        // Retorna sucesso na remoção
        res.status(200).json({ id: req.params.id, message: 'Arquivo removido com sucesso' });
    } catch (error) {
        // Trata erros de formato de ID ou servidor
        res.status(500).json({ message: 'Erro no servidor' });
    }
};