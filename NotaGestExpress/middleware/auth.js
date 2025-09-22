// Importa o jsonwebtoken para verificar o token
const jwt = require('jsonwebtoken');

// Middleware de autenticação
const auth = (req, res, next) => {
    // Pega o token do cabeçalho da requisição (geralmente 'x-auth-token')
    const token = req.header('x-auth-token');

    // Se o token não for encontrado, retorna um erro de não autorizado
    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        // Verifica o token usando a chave secreta do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adiciona o ID do usuário (decodificado do token) ao objeto de requisição
        req.user = decoded.id;
        
        // Chama o próximo middleware/função da rota
        next();
    } catch (e) {
        // Se o token for inválido, retorna um erro de não autorizado
        res.status(401).json({ msg: 'Token não é válido.' });
    }
};

module.exports = auth;