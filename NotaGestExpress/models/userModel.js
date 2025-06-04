// model está fazendo a inserção no banco de dados
const db = require('../config/db');

const createUser = (nome, email, senha, callback) => {
  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, senha], callback);
};

module.exports = { createUser };
