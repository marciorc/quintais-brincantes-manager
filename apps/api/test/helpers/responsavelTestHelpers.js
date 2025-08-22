const responsavelService = require('../../services/responsavelService');
const criancaService = require('../../services/criancaService');

const createTestResponsavel = async (responsavelData = {}) => {
  const defaultData = {
    nome: `Responsavel Teste ${Date.now()}`,
    email: `responsavel${Date.now()}@test.com`,
    contato: '11999999999',
    senha: 'senha123'
  };

  return await responsavelService.create({ ...defaultData, ...responsavelData });
};

const createTestCrianca = async (responsavelId, criancaData = {}) => {
  const defaultData = {
    nome: `Criança Teste ${Date.now()}`,
    dataNascimento: '2018-05-15',
    responsavelId: responsavelId
  };

  return await criancaService.create({ ...defaultData, ...criancaData });
};

module.exports = {
  createTestResponsavel,
  createTestCrianca
};