const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Tenta pegar o token do cabeçalho 'x-auth-token'
    const token = req.header('x-auth-token');

    // Se não houver token, retorna erro
    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        // Verifica o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adiciona o ID do usuário do token à requisição
        req.user = decoded.id;
        
        next(); // Continua para a próxima função (a rota)
    } catch (e) {
        res.status(401).json({ msg: 'Token não é válido.' });
    }
};

module.exports = auth;