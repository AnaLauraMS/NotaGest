// importação o jsonwebtoken para verificar o token
const jwt = require('jsonwebtoken');

// Carrega as variáveis de ambiente (necessário se o JWT_SECRET estiver no .env)
require('dotenv').config(); 

// Middleware de validação de token JWT
const auth = (req, res, next) => {
    // 1. Tenta resgatar o cabeçalho Authorization
    const authHeader = req.header('Authorization');

    // 2. Verifica se o cabeçalho existe
    if (!authHeader) {
        return res.status(401).json({ msg: 'Nenhum token fornecido, autorização negada.' });
    }
    
    // O formato esperado é "Bearer <token>". O split separa pelo espaço.
    const tokenParts = authHeader.split(' ');
    
    // 3. Verifica o formato e extrai o token
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Formato de token inválido. Use: Bearer <token>.' });
    }

    const token = tokenParts[1];

    try {
        // 4. Verifica o token usando a chave secreta (a mesma usada para assinar)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Adiciona a informação do usuário (ID ou payload completo) à requisição
        // Assumindo que o payload do token contém { id: '...' }
        req.user = decoded; // Armazena o payload decodificado inteiro
        
        // 6. Chama o próximo middleware/função da rota
        next();
    } catch (e) {
        // Logar o erro 'e' (ex: 'TokenExpiredError') pode ajudar na depuração.
        console.error("Erro na verificação do token:", e.message);
        
        // Retorna erro para token expirado ou inválido
        res.status(401).json({ msg: 'Token inválido ou expirado.' });
    }
};

module.exports = auth;
