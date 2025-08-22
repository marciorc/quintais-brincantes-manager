const criancaService = require('../../services/criancaService');
const responsavelService = require('../../services/responsavelService');
const turmaService = require('../../services/turmaService');

const createTestResponsavel = async (responsavelData = {}) => {
  const defaultData = {
    nome: `Responsavel Teste ${Date.now()}`,
    email: `responsavel${Date.now()}@test.com`,
    contato: '11999999999',
    senha: 'senha123'
  };

  return await responsavelService.create({ ...defaultData, ...responsavelData });
};

const createTestTurma = async (turmaData = {}) => {
  const defaultData = {
    nome: `Turma Teste ${Date.now()}`
  };

  return await turmaService.create({ ...defaultData, ...turmaData });
};

const createTestCrianca = async (responsavelId, turmaId = null, criancaData = {}) => {
  const defaultData = {
    nome: `Criança Teste ${Date.now()}`,
    dataNascimento: '2018-05-15',
    responsavelId: responsavelId,
    turmaId: turmaId
  };

  return await criancaService.create({ ...defaultData, ...criancaData });
};

module.exports = {
  createTestCrianca,
  createTestResponsavel,
  createTestTurma
};