const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  resource: { model: prisma.crianca, client: prisma },
  options: {
    navigation: 'Gestão',
    actions: {
      // outras ações
    }
  }
};