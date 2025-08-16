const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

module.exports = {
  resource: { model: prisma.admin, client: prisma },
  options: {
    navigation: 'Gestão',
    properties: {
      senhaHash: { isVisible: false },
      senha: {
        type: 'string',
        isVisible: { list: false, filter: false, show: false, edit: true },
      },
    },
    actions: {
      new: {
        before: async (request) => {
          if (request.payload?.senha) {
            request.payload.senhaHash = await bcrypt.hash(request.payload.senha, 10);
            delete request.payload.senha;
          }
          return request;
        },
      },
      edit: {
        before: async (request) => {
          if (request.payload?.senha) {
            request.payload.senhaHash = await bcrypt.hash(request.payload.senha, 10);
            delete request.payload.senha;
          }
          return request;
        },
      },
    },
  },
};