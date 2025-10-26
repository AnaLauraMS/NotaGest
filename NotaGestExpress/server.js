const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/mongoDb');
const { protect } = require('./middleware/auth');

// Rotas
const userRoutes = require('./routes/userRoutes');
const arquivoRoutes = require('./routes/arquivosRoutes');
const imovelRoutes = require('./routes/imovelRoutes');
const uploadFileRoutes = require('./routes/uploadFileRoutes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../NotaGestExpress/config/swaggerConfig');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log('📘 Swagger disponível em http://localhost:5000/api-docs');

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/uploads', arquivoRoutes);
app.use('/api/imoveis', imovelRoutes);
app.use('/api/uploadfile', uploadFileRoutes);

// Arquivos estáticos (uploads)
app.use('/uploads', protect, express.static(path.join(__dirname, 'uploads')));

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
