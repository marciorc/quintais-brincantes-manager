const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const router = express.Router();

const prisma = new PrismaClient();

// Middleware para autenticação JWT
function autenticarJWT(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

// GET /criancas – Listar todas as criancas do responsável autenticado
router.get('/criancas', autenticarJWT, async (req, res) => {
  try {
    const criancas = await prisma.amorinha.findMany({
      where: { responsavelId: req.user.id },
      include: { turma: true }
    });
    res.json(criancas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar criancas' });
  }
});

// GET /perfil – Dados do responsável autenticado
router.get('/perfil', autenticarJWT, async (req, res) => {
  try {
    const responsavel = await prisma.responsavel.findUnique({
      where: { id: req.user.id },
      select: { id: true, nome: true, email: true, contato: true, criadoEm: true }
    });
    res.json(responsavel);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

module.exports = router;