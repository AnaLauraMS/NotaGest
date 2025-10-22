// no projeto NotaGest Express -> middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Garante que process.env.JWT_SECRET está carregado

const protect = (req, res, next) => {
    // Log #1: Mostra a URL exata que chegou aqui
    console.log(`\n--- 🛡️  Middleware "protect" acionado para: ${req.method} ${req.originalUrl} ---`); 

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (!token || token === 'null') {
                 // Log #2a: Falha - Token nulo
                 console.error('   ❌ Token é nulo ou "null". Não autorizado.');
                 return res.status(401).json({ message: 'Não autorizado, token nulo' });
            }

            // Log #3: Mostra parte do token
            console.log('   Token recebido:', token.substring(0, 10) + '...'); 

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Log #4: Sucesso na verificação
            console.log('   ✅ Token decodificado com sucesso:', decoded);
            
            req.user = { id: decoded.id, email: decoded.email }; 
            
            // Log #5: Encaminhando
            console.log('   ➡️  Token válido. Encaminhando para o próximo handler...');
            next(); // Sucesso!
        } catch (error) {
            // Log #2b: Falha - Erro na verificação (expirado, assinatura inválida, etc.)
            console.error('   ❌ FALHA NA VERIFICAÇÃO DO TOKEN:', error.message);
            res.status(401).json({ message: `Token inválido: ${error.message}` });
        }
    } else {
        // Log #2c: Falha - Header não encontrado/mal formatado
        console.error('   ❌ Não autorizado, cabeçalho de autorização não fornecido ou mal formatado.');
        res.status(401).json({ message: 'Não autorizado, token não fornecido.' });
    }
};

module.exports = { protect };