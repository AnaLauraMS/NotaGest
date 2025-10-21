const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    console.log('\n--- 🛡️  Middleware "protect" foi acionado! ---'); // Log de entrada
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (!token || token === 'null') {
                 console.error('Token é nulo ou "null".');
                 return res.status(401).json({ message: 'Não autorizado, token nulo' });
            }

            console.log('Token recebido:', token.substring(0, 10) + '...');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            console.log('Token decodificado com sucesso:', decoded);
            
            req.user = { id: decoded.id, email: decoded.email }; 
            
            next();
        } catch (error) {
            console.error('FALHA NA VERIFICAÇÃO DO TOKEN:', error.message);
            res.status(401).json({ message: `Token inválido: ${error.message}` });
        }
    } else {
        console.error('Não autorizado, cabeçalho de autorização não fornecido ou mal formatado.');
        res.status(401).json({ message: 'Não autorizado, token não fornecido.' });
    }
};

module.exports = { protect };