// importação o jsonwebtoken para verificar o token
const jwt = require('jsonwebtoken');

// middleware de autenticação
const auth = (req, res, next) => {
    // resgata o token do cabeçalho da requisição 
    const token = req.header('x-auth-token');

    // caso o token não for encontrado retorna um erro de não autorizado
    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        // verifica o token usando a chave secreta do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // adicionando o ID do usuário (decodificado do token) ao objeto de requisição
        req.user = decoded.id;
        
        // chama o próximo middleware/função da rota
        next();
    } catch (e) {
        // caso o token for inválido, retorna um erro de não autorizado
        res.status(401).json({ msg: 'Token não é válido.' });
    }
};

module.exports = auth;