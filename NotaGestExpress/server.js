// server.js

// --- Importações ---
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
const connectDB = require('./config/mongoDb'); // Importa a função de conexão com o banco de dados
const { protect } = require('./middleware/auth'); // Importa o middleware de autenticação JWT
// Importa os roteadores da aplicação
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
connectDB(); // Inicia a conexão com o banco de dados

// --- Middlewares Globais ---
// Habilita o Cross-Origin Resource Sharing (CORS)
app.use(cors()); 
console.log('[INFO] Middleware CORS habilitado.');

// Habilita o parse de dados JSON no corpo das requisições
app.use(express.json()); 
console.log('[INFO] Middleware express.json habilitado.');

// --- Rotas da API ---
console.log('[INFO] Configurando rotas da API...');
// Rotas de usuários (perfil e sincronização interna)
app.use('/api/users', userRoutes);
console.log('   -> Rota /api/users registrada.');
// Rotas de arquivos (metadados)
app.use('/api/uploads', arquivoRoutes); 
console.log('   -> Rota /api/uploads registrada.');
// Rotas de imóveis (CRUD)
app.use('/api/imoveis', imovelRoutes);
console.log('   -> Rota /api/imoveis registrada.');
// Rota dedicada ao upload do arquivo físico
app.use('/api/uploadfile', uploadFileRoutes);
console.log('   -> Rota /api/uploadfile registrada.');
console.log('[INFO] Rotas da API configuradas.');

// --- Rota para Servir Arquivos Estáticos ---
console.log('[INFO] Configurando rota para servir arquivos estáticos...');
// Define o caminho absoluto para a pasta de uploads no servidor
const staticFilesPath = path.join(__dirname, 'uploads');
console.log(`   -> Caminho base para arquivos estáticos: ${staticFilesPath}`);

// Middleware de Log Específico para /uploads ANTES do protect/static
app.use('/uploads', (req, res, next) => {
    // Confirma que a requisição para arquivos estáticos está sendo processada
    console.log(`\n--- 🚚 Rota /uploads recebendo pedido para: ${req.method} ${req.originalUrl} ---`); 
    // Loga o caminho relativo que será buscado na pasta 'uploads'
    console.log(`   -> Caminho relativo (req.path) a ser processado: ${req.path}`); 
    next(); 
});

// Aplica o middleware de autenticação (protect) antes de servir o arquivo estático
app.use('/uploads', protect, express.static(staticFilesPath, {
    // Permite que requisições que falhem (arquivo não encontrado) passem para o handler 404
    fallthrough: true, 
    // Impede o acesso a arquivos ocultos (ex: .git, .env)
    dotfiles: 'deny' 
})); 
console.log('[INFO] Rota /uploads para arquivos estáticos configurada com autenticação.');

// --- Handler para Rotas Não Encontradas (404) ---
// Captura qualquer requisição que não foi tratada pelas rotas acima
app.use((req, res, next) => {
    // Log de alerta de rota não encontrada
    console.warn(`Rota não encontrada (404)`);
    console.warn(`   -> Requisição: ${req.method} ${req.originalUrl}`);
    console.warn(`   -> IP Origem: ${req.ip}`);
    // Retorna a resposta 404
    res.status(404).json({ message: 'Recurso não encontrado neste servidor.' });
});


// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n[INFO] Servidor rodando e escutando na porta ${PORT}`);
    console.log(`[INFO] Pressione CTRL+C para parar o servidor.`);
});