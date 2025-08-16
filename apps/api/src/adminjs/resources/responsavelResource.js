const { PrismaClient } = require('@prisma/client');
const { generateSecurityPassword } = require('../../utils/passwordGenerator');
const bcrypt = require('bcryptjs');

// Importa o modelo do Prisma
const prisma = new PrismaClient();

// Ação customizada para geração e exibição da senha
const copyPasswordAction = {
  new: {
    before: async (request) => {
      if (request.payload && !request.payload.senha) {
        const senha = generateSecurityPassword();
        request.payload.senha = senha;
        request.payload.senhaHash = await bcrypt.hash(senha, 10);
      }
      return request;
    },
    after: async (response, request) => {
      response.record.params.senha = request.payload.senha;
      return response;
    },
  },
};

module.exports = {
  resource: { model: prisma.responsavel, client: prisma },
  options: {
    navigation: 'Gestão',
    properties: {
      senhaHash: { isVisible: false },
      senha: {
        isVisible: { list: false, filter: false, show: true, edit: false },
        // Vamos adicionar o componente depois que o AdminJS estiver inicializado
      },
    },
    actions: {
      new: copyPasswordAction.new,
    },
  },
};