// chamando o modelo de usuario
const User = require("../models/userModel");

//chama o frontend, está validando e chama o model
const registerUser = (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  User.createUser(nome, email, senha, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email já cadastrado." });
      }
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar usuário." });
    }
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  });
};

module.exports = { registerUser };
