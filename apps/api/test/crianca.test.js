const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server.js');
const { getAuthToken } = require('./helpers/adminTestHelpers');
const { createTestCrianca, createTestResponsavel, createTestTurma } = require('./helpers/criancaTestHelpers');

describe('Crianca Routes', () => {
  let authToken;
  let testCrianca;
  let testCriancaId;
  let testResponsavel;
  let testResponsavelId;
  let testTurma;
  let testTurmaId;

  before(async () => {
    // Obter token de autenticação
    authToken = await getAuthToken();
    
    // Criar um responsável para testes
    testResponsavel = await createTestResponsavel();
    testResponsavelId = testResponsavel.id;
    
    // Criar uma turma para testes
    testTurma = await createTestTurma();
    testTurmaId = testTurma.id;
    
    // Criar uma criança para testes
    testCrianca = await createTestCrianca(testResponsavelId, testTurmaId);
    testCriancaId = testCrianca.id;
  });

  describe('GET /api/criancas', () => {
    it('should return list of criancas', async () => {
      const response = await supertest(app)
        .get('/api/criancas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.exist;
    });

    it('should search criancas by name', async () => {
      const response = await supertest(app)
        .get('/api/criancas?search=Teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      
      // Verifica se retorna array direto ou objeto com data (pagination)
      if (Array.isArray(response.body.data)) {
        expect(response.body.data).to.be.an('array');
      } else {
        expect(response.body.data).to.have.property('data');
        expect(response.body.data.data).to.be.an('array');
      }
    });

    it('should filter criancas by responsavelId', async () => {
      const response = await supertest(app)
        .get(`/api/criancas?responsavelId=${testResponsavelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should filter criancas by turmaId', async () => {
      const response = await supertest(app)
        .get(`/api/criancas?turmaId=${testTurmaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });
  });

  describe('GET /api/criancas/statistics', () => {
    it('should return crianca statistics', async () => {
      const response = await supertest(app)
        .get('/api/criancas/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.include.keys([
        'totalCriancas',
        'criancasComTurma',
        'criancasSemTurma',
        'percentualComTurma'
      ]);
    });
  });

  describe('GET /api/criancas/sem-turma', () => {
    it('should return criancas without turma', async () => {
      // Cria uma criança sem turma
      const criancaSemTurma = await createTestCrianca(testResponsavelId, null);

      const response = await supertest(app)
        .get('/api/criancas/sem-turma')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });
  });

  describe('GET /api/criancas/responsavel/:responsavelId', () => {
    it('should return criancas by responsavel', async () => {
      const response = await supertest(app)
        .get(`/api/criancas/responsavel/${testResponsavelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('GET /api/criancas/turma/:turmaId', () => {
    it('should return criancas by turma', async () => {
      const response = await supertest(app)
        .get(`/api/criancas/turma/${testTurmaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('GET /api/criancas/:id', () => {
    it('should return crianca by ID', async () => {
      const response = await supertest(app)
        .get(`/api/criancas/${testCriancaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id', testCriancaId);
      expect(response.body.data).to.have.property('nome');
    });

    it('should return 400 for invalid ID', async () => {
      await supertest(app)
        .get('/api/criancas/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 404 for non-existent crianca', async () => {
      await supertest(app)
        .get('/api/criancas/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('POST /api/criancas', () => {
    it('should create a new crianca', async () => {
      const newCrianca = {
        nome: 'Nova Criança Teste',
        dataNascimento: '2019-06-20',
        responsavelId: testResponsavelId,
        turmaId: testTurmaId
      };

      const response = await supertest(app)
        .post('/api/criancas')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(newCrianca)
        .expect(201);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', newCrianca.nome);
    });

    it('should return 400 for invalid data', async () => {
      const invalidCrianca = {
        nome: 'A', // Nome muito curto
        dataNascimento: 'invalid-date',
        responsavelId: 'invalid'
      };

      await supertest(app)
        .post('/api/criancas')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(invalidCrianca)
        .expect(400);
    });

    it('should return 404 for non-existent responsavel', async () => {
      const criancaWithInvalidResponsavel = {
        nome: 'Criança com Responsável Inválido',
        dataNascimento: '2019-06-20',
        responsavelId: 999999
      };

      await supertest(app)
        .post('/api/criancas')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(criancaWithInvalidResponsavel)
        .expect(404);
    });
  });

  describe('POST /api/criancas/update-turma-multiple', () => {
    it('should update turma for multiple criancas', async () => {
      const response = await supertest(app)
        .post('/api/criancas/update-turma-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId],
          turmaId: testTurmaId
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('count', 1);
    });

    it('should remove turma for multiple criancas', async () => {
      const response = await supertest(app)
        .post('/api/criancas/update-turma-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId],
          turmaId: null
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should return 400 for invalid data', async () => {
      await supertest(app)
        .post('/api/criancas/update-turma-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: 'invalid' // Deve ser array
        })
        .expect(400);
    });
  });

  describe('PUT /api/criancas/:id', () => {
    it('should update crianca with valid data', async () => {
      const updateData = {
        nome: 'Criança Atualizada',
        dataNascimento: '2020-01-15'
      };

      const response = await supertest(app)
        .put(`/api/criancas/${testCriancaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', updateData.nome);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        nome: 'A', // Nome muito curto
        dataNascimento: 'invalid-date'
      };

      await supertest(app)
        .put(`/api/criancas/${testCriancaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('DELETE /api/criancas/:id', () => {
    it('should delete crianca', async () => {
      // Cria uma criança temporária para deletar
      const tempCrianca = await createTestCrianca(testResponsavelId, null);

      const response = await supertest(app)
        .delete(`/api/criancas/${tempCrianca.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should return 404 for non-existent crianca', async () => {
      await supertest(app)
        .delete('/api/criancas/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});