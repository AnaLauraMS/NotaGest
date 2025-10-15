// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Corrigido: adiciona o ID no req
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

module.exports = { protect };