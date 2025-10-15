const userService = require('../services/userService');

// --- A. READ (GET /users/:id) ---
const getUserProfile = async (req, res) => {
    // ID do perfil solicitado (vem da URL: /users/:id)
    const profileId = req.params.id;  
    // ID do usuário logado (vem do token, anexado pelo middleware)
    const authenticatedUserId = req.userId; 

    // 1. Lógica de Autorização: O usuário só pode ver o próprio perfil.
    if (profileId !== authenticatedUserId) {
        return res.status(403).json({ 
            message: "Acesso Proibido. Você só pode visualizar seu próprio perfil." 
        });
    }

    try {
        const user = await userService.getProfileById(profileId);

        if (!user) {
            return res.status(404).json({ message: 'Perfil de usuário não encontrado.' });
        }

        // Não deve retornar a senha, mas como removemos a senha do Model, está seguro.
        res.status(200).json(user);

    } catch (error) {
        console.error('Erro ao buscar perfil:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


// --- B. UPDATE (PUT /users/:id) ---
const updateUserProfile = async (req, res) => {
    // ID do perfil a ser atualizado
    const profileId = req.params.id;  
    // ID do usuário logado
    const authenticatedUserId = req.userId; 

    // 1. Lógica de Autorização: Apenas o próprio usuário pode atualizar.
    if (profileId !== authenticatedUserId) {
        return res.status(403).json({ 
            message: "Acesso Proibido. Você só pode atualizar seu próprio perfil." 
        });
    }

    try {
        // Chama o serviço, passando o ID e os dados do corpo da requisição
        const updatedUser = await userService.updateProfileById(profileId, req.body);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Perfil de usuário não encontrado.' });
        }

        res.status(200).json({ 
            message: 'Perfil atualizado com sucesso!', 
            data: updatedUser 
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar o perfil.' });
    }
};


// --- C. DELETE (DELETE /users/:id) ---
const deleteUser = async (req, res) => {
    const profileId = req.params.id;
    const authenticatedUserId = req.userId;

    // 1. Lógica de Autorização: Apenas o próprio usuário pode deletar.
    if (profileId !== authenticatedUserId) {
        return res.status(403).json({ 
            message: "Acesso Proibido. Você só pode deletar seu próprio perfil." 
        });
    }

    try {
        const wasDeleted = await userService.deleteProfileById(profileId);

        if (!wasDeleted) {
            return res.status(404).json({ message: 'Perfil não encontrado para exclusão.' });
        }

        // Lembre-se: Após a exclusão do perfil, você DEVE notificar o
        // Microsserviço de Identidade para excluir o login/senha da conta.
        // A lógica de notificação deve ser inserida aqui ou no service.
        
        res.status(204).send(); // 204 No Content é o padrão para exclusão bem-sucedida

    } catch (error) {
        console.error('Erro ao deletar perfil:', error.message);
        res.status(500).json({ message: 'Erro ao tentar deletar o perfil.' });
    }
};


// --- D. ROTA INTERNA DE CRIAÇÃO (Chamada pelo Microsserviço de Identidade) ---
// Esta rota NÃO usa o middleware de token de usuário, deve ser protegida de outras formas.
const createProfileInternal = async (req, res) => {
    const { userId, email, nome } = req.body;
    
    // 1. Validação simples de entrada
    if (!userId || !email || !nome) {
        return res.status(400).json({ 
            message: 'Dados mínimos (userId, email, nome) são obrigatórios para a criação interna.' 
        });
    }

    try {
        // Chama o service para persistir o novo perfil
        await userService.createProfile(userId, email, nome);
        res.status(201).json({ message: 'Perfil criado com sucesso.' });
    } catch (error) {
        // Exemplo de tratamento de erro de duplicação (por userId ou email)
        if (error.message.includes('existe')) { // Baseado na mensagem do serviço
             return res.status(409).json({ message: 'Perfil de usuário já existe.' });
        }
        console.error('Erro na rota interna de criação:', error.message);
        res.status(500).json({ message: 'Erro interno ao processar a criação de perfil.' });
    }
};


// Exporta todas as funções para serem usadas no routes/userRoutes.js
module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUser,
    createProfileInternal, 
};