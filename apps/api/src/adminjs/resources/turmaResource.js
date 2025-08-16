const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  resource: { model: prisma.turma, client: prisma },
  options: {
    navigation: 'Gestão',
    properties: {
      id: { isVisible: false }, // Esconde o ID se desejar
    },
    actions: {
      // Ações padrão (new, edit, delete, list, show) já são fornecidas pelo AdminJS
    },
  },
};
