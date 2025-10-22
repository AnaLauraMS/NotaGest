// server.js

// --- Importações ---
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
const connectDB = require('./config/mongoDb');
const { protect } = require('./middleware/auth'); 
const userRoutes = require('./routes/userRoutes');
const arquivoRoutes = require('./routes/arquivosRoutes');
const imovelRoutes = require('./routes/imovelRoutes');
const uploadFileRoutes = require('./routes/uploadFileRoutes');

// --- Configuração Inicial ---
// 1. Carrega variáveis de ambiente ANTES de tudo
dotenv.config(); 
console.log('[INFO] Variáveis de ambiente carregadas.');

// 2. Inicializa o Express
const app = express();
console.log('[INFO] Aplicação Express inicializada.');

// 3. Conecta ao MongoDB
connectDB(); // A função connectDB já deve logar sucesso ou erro

// --- Middlewares Globais ---
// Habilita CORS para todas as origens (ajuste se precisar de mais restrições)
app.use(cors()); 
console.log('[INFO] Middleware CORS habilitado.');

// Habilita o parse de JSON no corpo das requisições
app.use(express.json()); 
console.log('[INFO] Middleware express.json habilitado.');

// --- Rotas da API ---
console.log('[INFO] Configurando rotas da API...');
app.use('/api/users', userRoutes);
console.log('   -> Rota /api/users registrada.');
app.use('/api/uploads', arquivoRoutes); 
console.log('   -> Rota /api/uploads registrada.');
app.use('/api/imoveis', imovelRoutes);
console.log('   -> Rota /api/imoveis registrada.');
app.use('/api/uploadfile', uploadFileRoutes);
console.log('   -> Rota /api/uploadfile registrada.');
console.log('[INFO] Rotas da API configuradas.');

// --- Rota para Servir Arquivos Estáticos ---
console.log('[INFO] Configurando rota para servir arquivos estáticos...');
const staticFilesPath = path.join(__dirname, 'uploads');
console.log(`   -> Caminho base para arquivos estáticos: ${staticFilesPath}`);

// Middleware de Log Específico para /uploads ANTES do protect/static
app.use('/uploads', (req, res, next) => {
    // Log #6: Confirma que a requisição chegou na rota /uploads
    console.log(`\n--- 🚚 Rota /uploads recebendo pedido para: ${req.method} ${req.originalUrl} ---`); 
    // Loga o caminho que será passado para protect e express.static
    console.log(`   -> Caminho relativo (req.path) a ser processado: ${req.path}`); 
    next(); 
});

// Aplica 'protect' e depois 'express.static' para a rota /uploads
app.use('/uploads', protect, express.static(staticFilesPath, {
    // Opção importante: O que fazer se o arquivo não for encontrado?
    // 'fallthrough: true' (padrão) chama next() -> cai no 404 handler abaixo
    // 'fallthrough: false' envia 404 diretamente daqui
    fallthrough: true, 
    // Opcional: negar acesso a dotfiles (ex: .git)
    dotfiles: 'deny' 
})); 
console.log('[INFO] Rota /uploads para arquivos estáticos configurada com autenticação.');

// --- Handler para Rotas Não Encontradas (404) ---
// Este middleware só será executado se nenhuma rota anterior corresponder
app.use((req, res, next) => {
    // Log #7: Indica que nenhuma rota foi encontrada
    console.warn(`\n--- ❓ Rota não encontrada (404) ---`);
    console.warn(`   -> Requisição: ${req.method} ${req.originalUrl}`);
    console.warn(`   -> IP Origem: ${req.ip}`);
    res.status(404).json({ message: 'Recurso não encontrado neste servidor.' });
});

// --- Handler Global de Erros (Opcional, mas bom para erros inesperados) ---
// app.use((err, req, res, next) => {
//    console.error('\n--- 💥 Erro Inesperado no Servidor! ---');
//    console.error('   -> Rota:', req.method, req.originalUrl);
//    console.error('   -> Erro:', err.message);
//    console.error('   -> Stack:', err.stack);
//    res.status(500).json({ message: 'Erro interno no servidor.' });
// });

// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n[INFO] Servidor rodando e escutando na porta ${PORT}`);
    console.log(`[INFO] Pressione CTRL+C para parar o servidor.`);
});