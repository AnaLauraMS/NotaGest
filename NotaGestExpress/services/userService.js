const User = require('../models/userModel'); // Importa o modelo de PERFIL do usuário (dados de negócio)

// --- A. CRIAÇÃO DE PERFIL (Chamada Interna do Serviço de Identidade) ---
/**
 * @function createProfile
 * @description Cria um novo perfil de usuário, sincronizando dados de um serviço externo.
 */
const createProfile = async (userId, email, nome) => {
    try {
        // Cria uma nova instância do perfil no banco de dados
        const newProfile = new User({
            userId, // Chave de vinculação com o Serviço de Identidade
            email,            
            nome,             
        });
        
        await newProfile.save();
        return newProfile;
    } catch (error) {
        // Trata erro de chave duplicada (código 11000 do MongoDB)
        if (error.code === 11000) {
            throw new Error('Usuário já existe.');
        }
        console.error('Erro ao criar perfil:', error);
        throw new Error('Falha na criação do perfil.');
    }
};


// --- B. READ (GET) ---
/**
 * @function getProfileById
 * @description Busca um perfil de usuário usando o ID de autenticação.
 */
const getProfileById = async (userId) => {
    // Busca o perfil pela chave de vinculação (userId)
    return await User.findOne({ userId });
};


// --- C. UPDATE (PUT) ---
/**
 * @function updateProfileById
 * @description Atualiza dados do perfil de um usuário específico.
 */
const updateProfileById = async (userId, updateData) => {
    // Lógica de segurança: Previne a alteração de campos de vinculação críticos
    delete updateData.userId; 
    delete updateData.email; 

    // Executa a busca e atualização no banco de dados
    const updatedProfile = await User.findOneAndUpdate(
        { userId }, // Filtro de busca
        { $set: updateData, updatedAt: Date.now() }, // Dados a serem atualizados e atualização do timestamp
        { new: true, runValidators: true } // Retorna o documento atualizado e executa validações
    );

    return updatedProfile;
};


// --- D. DELETE ---
/**
 * @function deleteProfileById
 * @description Remove o perfil do usuário do sistema.
 */
const deleteProfileById = async (userId) => {
    // Executa a operação de exclusão
    const result = await User.deleteOne({ userId });
    
    // Retorna 'true' se o documento foi excluído com sucesso
    if (result.deletedCount > 0) {
        // Nota: O Controller (ou um sistema de eventos) é responsável por notificar
        // o Serviço de Identidade para completar a exclusão da conta de login.
        return true; 
    }
    return false;
};

// Exporta as funções de serviço para a camada de controller
module.exports = {
    createProfile,
    getProfileById,
    updateProfileById,
    deleteProfileById,
};