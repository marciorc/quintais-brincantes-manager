const turmaService = require('../../services/turmaService');
const criancaService = require('../../services/criancaService');
const responsavelService = require('../../services/responsavelService');

const createTestTurma = async (turmaData = {}) => {
  const defaultData = {
    nome: `Turma Teste ${Date.now()}`
  };

  return await turmaService.create({ ...defaultData, ...turmaData });
};

const createTestCrianca = async (criancaData = {}) => {
  // Primeiro cria um responsável COM EMAIL
  const responsavel = await responsavelService.create({
    nome: `Responsável Teste ${Date.now()}`,
    email: `resp${Date.now()}@test.com`,
    contato: '11999999999',
    senha: 'senha123'
  });

  const defaultData = {
    nome: `Criança Teste ${Date.now()}`,
    dataNascimento: '2018-05-15',
    responsavelId: responsavel.id
  };

  return await criancaService.create({ ...defaultData, ...criancaData });
};

const createTestTurmaWithCriancas = async (criancasCount = 2) => {
  const turma = await createTestTurma();
  
  const criancas = [];
  for (let i = 0; i < criancasCount; i++) {
    const crianca = await createTestCrianca();
    criancas.push(crianca);
    
    // Adiciona criança à turma
    await turmaService.addCriancas(turma.id, [crianca.id]);
  }
  
  return { turma, criancas };
};

module.exports = {
  createTestTurma,
  createTestCrianca,
  createTestTurmaWithCriancas
};