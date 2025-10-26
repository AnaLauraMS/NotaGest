const userService = require('../services/userService'); // Importa a camada de serviço que lida com a lógica de negócio

/**
 * @openapi
 * tags:
 *   - name: Usuários
 *     description: Cadastro, login e gerenciamento de usuários
 */

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags: [Usuários]
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Ana Laura"
 *               email: "ana@example.com"
 *               password: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Usuário já existe
 */

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags: [Usuários]
 *     summary: Realiza login e retorna o token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               email: "ana@example.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             example:
 *               _id: "671a9a2239fbd101bf4d3cc5"
 *               name: "Ana Laura"
 *               email: "ana@example.com"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Usuários]
 *     summary: Retorna dados do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         example: 671a9a2239fbd101bf4d3cc5
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */


// --- A. READ (GET /users/:id) ---
/**
 * @function getUserProfile
 * @description Controller para buscar os dados do perfil de um usuário específico.
 * @access Private (Autorizado apenas para o próprio usuário)
 */
const getUserProfile = async (req, res) => {
    // ID do perfil solicitado (obtido da URL)
    const profileId = req.params.id; 
    // ID do usuário logado (obtido do token JWT via middleware)
    const authenticatedUserId = req.userId; 

    // 1. Lógica de Autorização: Impede que um usuário acesse o perfil de outro
    if (profileId !== authenticatedUserId) {
        return res.status(403).json({ 
            message: "Acesso Proibido. Você só pode visualizar seu próprio perfil." 
        });
    }

    try {
        // Chama o serviço para buscar o perfil no banco de dados
        const user = await userService.getProfileById(profileId);

        // Checa se o perfil foi encontrado
        if (!user) {
            return res.status(404).json({ message: 'Perfil de usuário não encontrado.' });
        }

        // Retorna os dados do perfil com status 200 (OK)
        res.status(200).json(user);

    } catch (error) {
        // Loga e retorna erro interno do servidor
        console.error('Erro ao buscar perfil:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


// --- B. UPDATE (PUT /users/:id) ---
/**
 * @function updateUserProfile
 * @description Controller para atualizar os dados do perfil do usuário.
 * @access Private (Autorizado apenas para o próprio usuário)
 */
const updateUserProfile = async (req, res) => {
    // ID do perfil a ser atualizado
    const profileId = req.params.id; 
    // ID do usuário logado (para verificação de segurança)
    const authenticatedUserId = req.userId; 

    // 1. Lógica de Autorização: Garante que o usuário está atualizando apenas seu próprio perfil
    if (profileId !== authenticatedUserId) {
        return res.status(403).json({ 
            message: "Acesso Proibido. Você só pode atualizar seu próprio perfil." 
        });
    }

    try {
        // Chama o serviço para aplicar as atualizações no banco
        const updatedUser = await userService.updateProfileById(profileId, req.body);

        // Checa se o perfil foi encontrado e atualizado
        if (!updatedUser) {
            return res.status(404).json({ message: 'Perfil de usuário não encontrado.' });
        }

        // Retorna a confirmação e os novos dados do perfil
        res.status(200).json({ 
            message: 'Perfil atualizado com sucesso!', 
            data: updatedUser 
        });

    } catch (error) {
        // Loga e retorna erro
        console.error('Erro ao atualizar perfil:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar o perfil.' });
    }
};


// --- C. DELETE (DELETE /users/:id) ---
/**
 * @function deleteUser
 * @description Controller para excluir o perfil do usuário.
 * @access Private (Autorizado apenas para o próprio usuário)
 */
const deleteUser = async (req, res) => {
    const profileId = req.params.id;
    const authenticatedUserId = req.userId;

    // 1. Lógica de Autorização: Garante que o usuário está deletando apenas seu próprio perfil
    if (profileId !== authenticatedUserId) {
        return res.status(403).json({ 
            message: "Acesso Proibido. Você só pode deletar seu próprio perfil." 
        });
    }

    try {
        // Chama o serviço para remover o perfil do banco de dados
        const wasDeleted = await userService.deleteProfileById(profileId);

        if (!wasDeleted) {
            return res.status(404).json({ message: 'Perfil não encontrado para exclusão.' });
        }

        // Lembre-se: Em uma arquitetura de microsserviços, a exclusão da conta de login
        // (do outro serviço) deve ser acionada a partir deste ponto (pelo service).
        
        // Retorna status 204 (No Content) indicando sucesso na exclusão
        res.status(204).send(); 

    } catch (error) {
        console.error('Erro ao deletar perfil:', error.message);
        res.status(500).json({ message: 'Erro ao tentar deletar o perfil.' });
    }
};


// --- D. ROTA INTERNA DE CRIAÇÃO (Chamada pelo Microsserviço de Identidade) ---
/**
 * @function createProfileInternal
 * @description Controller interno para criar o perfil após o registro em outro serviço.
 * @access Internal (Deve ser protegido contra acesso externo)
 */
const createProfileInternal = async (req, res) => {
    // Recebe dados essenciais de outro microsserviço
    const { userId, email, nome } = req.body;
    
    // 1. Validação simples de entrada dos dados de sincronização
    if (!userId || !email || !nome) {
        return res.status(400).json({ 
            message: 'Dados mínimos (userId, email, nome) são obrigatórios para a criação interna.' 
        });
    }

    try {
        // Chama o service para persistir o novo perfil
        await userService.createProfile(userId, email, nome);
        // Retorna 201 (Created)
        res.status(201).json({ message: 'Perfil criado com sucesso.' });
    } catch (error) {
        // Exemplo de tratamento de erro de duplicação
        if (error.message.includes('existe')) { 
            return res.status(409).json({ message: 'Perfil de usuário já existe.' }); // Conflito
        }
        // Logs e retorno de erro interno
        console.error('Erro na rota interna de criação:', error.message);
        res.status(500).json({ message: 'Erro interno ao processar a criação de perfil.' });
    }
};


// Exporta todas as funções controladoras
module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUser,
    createProfileInternal, 
};