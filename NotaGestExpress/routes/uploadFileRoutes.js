// routes/uploadFileRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path'); // <<< --- ADICIONE ESTA LINHA --- <<<
const { protect } = require('../middleware/auth');
// Verifique se o caminho para o middleware de upload está correto
// O nome do arquivo pode ser 'upload.js' ou 'uploads.js'
const uploadMiddleware = require('../middleware/uploads'); // Ou require('../middleware/uploads');

/*
 * @route   POST /api/uploadfile
 * @desc    Recebe um único arquivo via FormData, salva-o na pasta do usuário e retorna o caminho relativo.
 * @access  Private (requer token JWT)
 */
router.post(
    '/',
    protect,
    uploadMiddleware,
    (req, res) => {
        if (!req.file) {
            console.error('Tentativa de upload falhou: Nenhum arquivo recebido ou arquivo rejeitado.');
            return res.status(400).json({ message: 'Nenhum arquivo válido foi enviado.' });
        }

        // AGORA 'path.join' VAI FUNCIONAR PORQUE 'path' FOI IMPORTADO
        const relativePath = path.join(req.user.id.toString(), req.file.filename).replace(/\\/g, '/');

        console.log(`✅ Arquivo recebido e salvo: ${req.file.originalname} -> ${req.file.path}`);
        console.log(`   Retornando caminho relativo para o cliente: ${relativePath}`);

        res.status(200).json({
            message: 'Arquivo enviado com sucesso!',
            filePath: relativePath
        });
    }
);

module.exports = router;