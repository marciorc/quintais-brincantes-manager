const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server.js');
const { createTestAdmin, getAuthToken } = require('./helpers/adminTestHelpers');
const { createTestTurma, createTestCrianca } = require('./helpers/turmaTestHelpers');

describe('Turma Routes', () => {
  let authToken;
  let testTurma;
  let testTurmaId;
  let testCrianca;
  let testCriancaId;

  before(async () => {
    // Obter token de autenticação
    authToken = await getAuthToken();
    
    // Criar uma turma para testes
    testTurma = await createTestTurma();
    testTurmaId = testTurma.id;
    
    // Criar uma criança para testes
    testCrianca = await createTestCrianca();
    testCriancaId = testCrianca.id;
  });

  describe('GET /api/turmas', () => {
    it('should return list of turmas', async () => {
      const response = await supertest(app)
        .get('/api/turmas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.exist;
    });

    it('should return simplified format when simple=true', async () => {
      const response = await supertest(app)
        .get('/api/turmas?simple=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data[0]).to.include.keys('id', 'nome');
    });

    it('should search turmas by name', async () => {
      const response = await supertest(app)
        .get('/api/turmas?search=Teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      
      // Verifica se retorna array direto ou objeto com data
      if (Array.isArray(response.body.data)) {
        expect(response.body.data).to.be.an('array');
      } else {
        expect(response.body.data).to.have.property('data');
        expect(response.body.data.data).to.be.an('array');
      }
    });
  });

  describe('GET /api/turmas/statistics', () => {
    it('should return turma statistics', async () => {
      const response = await supertest(app)
        .get('/api/turmas/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.include.keys([
        'totalTurmas',
        'turmasComCriancas',
        'turmasVazias',
        'taxaOcupacao'
      ]);
    });
  });

  describe('GET /api/turmas/vazias', () => {
    it('should return empty turmas', async () => {
      const response = await supertest(app)
        .get('/api/turmas/vazias')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('data');
    });
  });

  describe('GET /api/turmas/:id', () => {
    it('should return turma by ID', async () => {
      const response = await supertest(app)
        .get(`/api/turmas/${testTurmaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id', testTurmaId);
      expect(response.body.data).to.have.property('nome');
    });

    it('should return 400 for invalid ID', async () => {
      await supertest(app)
        .get('/api/turmas/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 404 for non-existent turma', async () => {
      await supertest(app)
        .get('/api/turmas/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /api/turmas/:id/criancas', () => {
    it('should return children from turma', async () => {
      const response = await supertest(app)
        .get(`/api/turmas/${testTurmaId}/criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('POST /api/turmas', () => {
    it('should create a new turma', async () => {
      const newTurma = {
        nome: `Nova Turma ${Date.now()}`
      };

      const response = await supertest(app)
        .post('/api/turmas')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(newTurma)
        .expect(201);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', newTurma.nome);
    });

    it('should return 400 for invalid data', async () => {
      const invalidTurma = {
        nome: 'A' // Nome muito curto
      };

      await supertest(app)
        .post('/api/turmas')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(invalidTurma)
        .expect(400);
    });

    it('should return 409 for duplicate nome', async () => {
      const duplicateTurma = {
        nome: testTurma.nome // Nome já existente
      };

      await supertest(app)
        .post('/api/turmas')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(duplicateTurma)
        .expect(409);
    });
  });

  describe('POST /api/turmas/:id/add-criancas', () => {
    it('should add children to turma', async () => {
      const response = await supertest(app)
        .post(`/api/turmas/${testTurmaId}/add-criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId]
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('count', 1);
    });

    it('should return 400 for invalid data', async () => {
      await supertest(app)
        .post(`/api/turmas/${testTurmaId}/add-criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: 'invalid' // Deve ser array
        })
        .expect(400);
    });
  });

  describe('POST /api/turmas/:id/remove-criancas', () => {
    it('should remove children from turma', async () => {
      // Primeiro adiciona uma criança para depois remover
      await supertest(app)
        .post(`/api/turmas/${testTurmaId}/add-criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId]
        });

      const response = await supertest(app)
        .post(`/api/turmas/${testTurmaId}/remove-criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId]
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('count', 1);
    });
  });

  describe('PUT /api/turmas/:id', () => {
    it('should update turma with valid data', async () => {
      const updateData = {
        nome: `Turma Atualizada ${Date.now()}`
      };

      const response = await supertest(app)
        .put(`/api/turmas/${testTurmaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', updateData.nome);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        nome: 'A' // Nome muito curto
      };

      await supertest(app)
        .put(`/api/turmas/${testTurmaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('DELETE /api/turmas/:id', () => {
    it('should delete empty turma', async () => {
      // Cria uma turma temporária vazia para deletar
      const tempTurma = await createTestTurma({
        nome: `Temp Turma ${Date.now()}`
      });

      const response = await supertest(app)
        .delete(`/api/turmas/${tempTurma.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should return 404 for non-existent turma', async () => {
      await supertest(app)
        .delete('/api/turmas/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 409 for turma with children (without force)', async () => {
      // Cria uma turma com crianças
      const turmaComCriancas = await createTestTurma({
        nome: `Turma com Crianças ${Date.now()}`
      });

      // Adiciona uma criança à turma
      await supertest(app)
        .post(`/api/turmas/${turmaComCriancas.id}/add-criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId]
        });

      await supertest(app)
        .delete(`/api/turmas/${turmaComCriancas.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(409);
    });

    it('should delete turma with children when force=true', async () => {
      // Cria uma turma com crianças
      const turmaComCriancas = await createTestTurma({
        nome: `Turma Force Delete ${Date.now()}`
      });

      // Adiciona uma criança à turma
      await supertest(app)
        .post(`/api/turmas/${turmaComCriancas.id}/add-criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          criancaIds: [testCriancaId]
        });

      const response = await supertest(app)
        .delete(`/api/turmas/${turmaComCriancas.id}?force=true`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });
  });
});