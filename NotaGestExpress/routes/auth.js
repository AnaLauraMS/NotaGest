const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    return res.status(201).json({ message: 'Usuário registrado com sucesso' });
  });
});

module.exports = router;
