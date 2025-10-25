// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Função para garantir que o diretório do usuário exista
const ensureUserDirExists = (userId) => {
  const userDirPath = path.join('uploads', userId.toString()); // Cria caminho ex: 'uploads/68f65...'
  if (!fs.existsSync(userDirPath)) {
    fs.mkdirSync(userDirPath, { recursive: true }); // Cria a pasta se não existir
  }
  return userDirPath;
};

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Salva na pasta específica do usuário (req.user.id vem do middleware 'protect')
    const userDirPath = ensureUserDirExists(req.user.id); 
    cb(null, userDirPath);
  },
  filename: function (req, file, cb) {
    // Gera um nome único para evitar colisões: timestamp-nomeoriginal.extensao
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

// Filtro de arquivo (opcional - exemplo para aceitar apenas alguns tipos)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Formato de arquivo não suportado!'), false);
//   }
// };

const upload = multer({ 
  storage: storage,
  // fileFilter: fileFilter, // Descomente para usar o filtro
  // limits: { fileSize: 1024 * 1024 * 5 } // Opcional: Limite de 5MB
});

module.exports = upload.single('file');