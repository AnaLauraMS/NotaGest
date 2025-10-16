const User = require('../models/userModel');

// --- A. CRIAÇÃO DE PERFIL (Chamada Interna do Serviço de Identidade) ---
// O Serviço de Identidade chama esta função para criar o perfil.
const createProfile = async (userId, email, nome) => {
    try {
        const newProfile = new User({
            userId,
            email,            
            nome,             
        });
        
        await newProfile.save();
        return newProfile;
    } catch (error) {
        // Trate erro de chave duplicada (userId ou email)
        if (error.code === 11000) {
            throw new Error('Usuário já existe.');
        }
        console.error('Erro ao criar perfil:', error);
        throw new Error('Falha na criação do perfil.');
    }
};


// --- B. READ (GET) ---
const getProfileById = async (userId) => {
    // Busca pelo nosso novo campo principal 'userId'
    return await User.findOne({ userId });
};


// --- C. UPDATE (PUT) ---
const updateProfileById = async (userId, updateData) => {
    // Garante que o ID e o Email NÃO possam ser alterados via update do perfil.
    delete updateData.userId; 
    delete updateData.email; 

    // Atualiza o perfil
    const updatedProfile = await User.findOneAndUpdate(
        { userId }, 
        { $set: updateData, updatedAt: Date.now() }, 
        { new: true, runValidators: true }
    );

    return updatedProfile;
};


// --- D. DELETE ---
const deleteProfileById = async (userId) => {
    // Remove o perfil
    const result = await User.deleteOne({ userId });
    
    if (result.deletedCount > 0) {
        // Se a exclusão for bem-sucedida, o Controller precisa chamar a notificação
        // para que o Serviço de Identidade também exclua a conta de login!
        return true; 
    }
    return false;
};

module.exports = {
    createProfile,
    getProfileById,
    updateProfileById,
    deleteProfileById,
};