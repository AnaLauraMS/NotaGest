// controllers/arquivoController.js
const Arquivo = require('../models/arquivosModel');
const User = require('../models/userModel'); 

/**
 * @openapi
 * tags:
 *   - name: Arquivos
 *     description: Uploads e gerenciamento de notas fiscais
 */

/**
 * @openapi
 * /api/uploads:
 *   get:
 *     tags: [Arquivos]
 *     summary: Lista arquivos enviados pelo usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: propertyId
 *         in: query
 *         description: Nome do imóvel para filtrar os arquivos
 *         required: false
 *         schema:
 *           type: string
 *           example: Casa Nova
 *     responses:
 *       200:
 *         description: Retorna todos os arquivos do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Arquivo'
 *       401:
 *         description: Token inválido ou ausente
 */

/**
 * @openapi
 * /api/uploads:
 *   post:
 *     tags: [Arquivos]
 *     summary: Cadastra metadados de um novo arquivo (nota fiscal, documento, etc.)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: "Nota fiscal de tinta"
 *               value: 250.90
 *               purchaseDate: "2025-09-20"
 *               property: "Casa Nova"
 *               category: "Materiais"
 *               subcategory: "Pintura"
 *               observation: "Compra feita na loja ColorMais"
 *               filePath: "/uploads/1718205958340-tinta.pdf"
 *     responses:
 *       201:
 *         description: Arquivo salvo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Arquivo'
 */

/**
 * @openapi
 * /api/uploads/{id}:
 *   delete:
 *     tags: [Arquivos]
 *     summary: Deleta um arquivo específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 671a9b5d39fbd101bf4d3cc7
 *     responses:
 *       200:
 *         description: Arquivo removido com sucesso
 *       404:
 *         description: Arquivo não encontrado
 */


/**
 * @function getArquivos
 * @description Controller para buscar todos os arquivos associados ao usuário logado,
 * com opção de filtragem por nome de imóvel via query parameter.
 * @route GET /api/uploads?propertyId=<nome_do_imovel>
 * @access Private
 */
exports.getArquivos = async (req, res) => {
    // 1. Obtém o nome do imóvel para filtrar, enviado como query parameter (ex: ?propertyId=Teste)
    const propertyName = req.query.propertyId; 
    
    // Log para verificar se o filtro chegou corretamente no backend
    console.log(`Rota GET /api/uploads acionada. Filtro Imóvel: ${propertyName || 'Nenhum'}`);
    console.log("Usuário autenticado ID:", req.user.id);

    try {
        // 2. Constrói o objeto de consulta (query)
        // Inicialmente, filtra apenas pelo ID do usuário
        const query = { user: req.user.id };

        // 3. Adiciona a condição de filtro se o propertyName for fornecido e não for uma string vazia
        if (propertyName) {
            // Adiciona a condição: campo 'property' no DB deve ser igual ao nome fornecido
            query.property = propertyName;
            console.log("Consulta MongoDB com filtro:", query);
        }

        // 4. Executa a busca no MongoDB com o objeto de consulta (filtrado ou não)
        const arquivos = await Arquivo.find(query).sort({ createdAt: -1 });
        
        console.log(`Encontrados ${arquivos.length} arquivos para o usuário.`);
        
        // 5. Retorna os resultados
        res.status(200).json(arquivos);
    } catch (error) {
        console.error("ERRO NO CONTROLLER getArquivos:", error); 
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
    console.log('Entrou createArquivo com dados:', req.body);
    try {
        // Pega o filePath junto com os outros dados
        const { title, value, purchaseDate, property, category, subcategory, observation, filePath } = req.body; 

        // Validação (mantenha ou adicione conforme necessário)
        if (!title || !value || !purchaseDate || !property || !category || !subcategory) {
            return res.status(400).json({ message: 'Campos obrigatórios faltando.'});
        }

        const novoArquivo = await Arquivo.create({
            title, value, purchaseDate, property, category, subcategory, observation, 
            filePath, // Salva o caminho do arquivo
            user: req.user.id 
        });

        console.log('✅ Arquivo (metadados) criado:', novoArquivo);
        res.status(201).json(novoArquivo);
    } catch (error) {
        console.error("ERRO AO CRIAR ARQUIVO:", error);
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
        const arquivo = await Arquivo.findById(req.params.id);

        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        // VERIFICAÇÃO DE SEGURANÇA: Garante que o usuário só pode deletar seus próprios arquivos
        if (arquivo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Não autorizado' });
        }

        await arquivo.deleteOne(); 

        res.status(200).json({ id: req.params.id, message: 'Arquivo removido com sucesso' });
    } catch (error) {
        console.error("ERRO AO DELETAR ARQUIVO:", error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};