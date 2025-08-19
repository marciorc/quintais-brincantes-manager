const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { adminJs, router: adminRouter } = require('./src/adminjs/adminjs')
const { PrismaClient } = require('@prisma/client');
const path = require('path')
const prisma = new PrismaClient();
const app = express();
dotenv.config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/adminjs-components', express.static(path.join(__dirname, 'src/adminjs/components')));

// Autenticação de responsável
app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await prisma.responsavel.findUnique({ where: { email } });
  if (!user || !bcrypt.compareSync(senha, user.senhaHash)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user.id, nome: user.nome }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

app.use(adminJs.options.rootPath, adminRouter)

app.get('/', (req, res) => {
  res.send('API do Quintais Brincantes Manager rodando 🚀');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API ouvindo na porta ${PORT}`);
});

module.exports = app;