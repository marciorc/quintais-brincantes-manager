const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server.js');
const { getAuthToken } = require('./helpers/adminTestHelpers');
const { createTestResponsavel, createTestCrianca } = require('./helpers/responsavelTestHelpers');

describe('Responsavel Routes', () => {
  let authToken;
  let testResponsavel;
  let testResponsavelId;
  let testCrianca;
  let testCriancaId;

  before(async () => {
    // Obter token de autenticação
    authToken = await getAuthToken();
    
    // Criar um responsável para testes
    testResponsavel = await createTestResponsavel();
    testResponsavelId = testResponsavel.id;
    
    // Criar uma criança vinculada ao responsável
    testCrianca = await createTestCrianca(testResponsavelId);
    testCriancaId = testCrianca.id;
  });

  describe('GET /api/responsaveis', () => {
    it('should return list of responsaveis', async () => {
      const response = await supertest(app)
        .get('/api/responsaveis')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.exist;
    });

    it('should search responsaveis by name or email', async () => {
      const response = await supertest(app)
        .get('/api/responsaveis?search=Teste')
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
  });

  describe('GET /api/responsaveis/statistics', () => {
    it('should return responsavel statistics', async () => {
      const response = await supertest(app)
        .get('/api/responsaveis/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.include.keys([
        'totalResponsaveis',
        'totalCriancas',
        'mediaCriancasPorResponsavel'
      ]);
    });
  });

  describe('GET /api/responsaveis/:id', () => {
    it('should return responsavel by ID', async () => {
      const response = await supertest(app)
        .get(`/api/responsaveis/${testResponsavelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id', testResponsavelId);
      expect(response.body.data).to.have.property('nome');
      expect(response.body.data).to.have.property('email');
    });

    it('should return 400 for invalid ID', async () => {
      await supertest(app)
        .get('/api/responsaveis/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 404 for non-existent responsavel', async () => {
      await supertest(app)
        .get('/api/responsaveis/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /api/responsaveis/:id/criancas', () => {
    it('should return children from responsavel', async () => {
      const response = await supertest(app)
        .get(`/api/responsaveis/${testResponsavelId}/criancas`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('POST /api/responsaveis', () => {
    it('should create a new responsavel', async () => {
      const newResponsavel = {
        nome: 'Novo Responsavel Teste',
        email: `novo.responsavel${Date.now()}@test.com`,
        contato: '11999999999',
        senha: 'senha123'
      };

      const response = await supertest(app)
        .post('/api/responsaveis')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(newResponsavel)
        .expect(201);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', newResponsavel.nome);
      expect(response.body.data).to.have.property('email', newResponsavel.email);
    });

    it('should return 400 for invalid data', async () => {
      const invalidResponsavel = {
        nome: 'A', // Nome muito curto
        email: 'invalid-email',
        contato: '123',
        senha: '123' // Senha muito curta
      };

      await supertest(app)
        .post('/api/responsaveis')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(invalidResponsavel)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const duplicateResponsavel = {
        nome: 'Responsavel Duplicado',
        email: testResponsavel.email, // Email já existente
        contato: '11999999999',
        senha: 'senha123'
      };

      await supertest(app)
        .post('/api/responsaveis')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(duplicateResponsavel)
        .expect(409);
    });
  });

  describe('POST /api/responsaveis/authenticate', () => {
    it('should authenticate responsavel with valid credentials', async () => {
      const response = await supertest(app)
        .post('/api/responsaveis/authenticate')
        .set('Content-Type', 'application/json')
        .send({
          email: testResponsavel.email,
          senha: 'senha123'
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id');
      expect(response.body.data).to.have.property('nome');
      expect(response.body.data).to.have.property('email');
    });

    it('should return 401 for invalid credentials', async () => {
      await supertest(app)
        .post('/api/responsaveis/authenticate')
        .set('Content-Type', 'application/json')
        .send({
          email: testResponsavel.email,
          senha: 'senha-errada'
        })
        .expect(401);
    });

    it('should return 400 for missing credentials', async () => {
      await supertest(app)
        .post('/api/responsaveis/authenticate')
        .set('Content-Type', 'application/json')
        .send({
          email: testResponsavel.email
          // senha faltando
        })
        .expect(400);
    });
  });

  describe('PUT /api/responsaveis/:id', () => {
    it('should update responsavel with valid data', async () => {
      const updateData = {
        nome: 'Responsavel Atualizado',
        email: `atualizado${Date.now()}@test.com`,
        contato: '11888888888'
      };

      const response = await supertest(app)
        .put(`/api/responsaveis/${testResponsavelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', updateData.nome);
      expect(response.body.data).to.have.property('email', updateData.email);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        nome: 'A', // Nome muito curto
        email: 'invalid-email',
        contato: '123'
      };

      await supertest(app)
        .put(`/api/responsaveis/${testResponsavelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('DELETE /api/responsaveis/:id', () => {
    it('should delete responsavel without children', async () => {
      // Cria um responsável temporário sem crianças para deletar
      const tempResponsavel = await createTestResponsavel({
        nome: 'Temp Responsavel',
        email: `temp${Date.now()}@test.com`
      });

      const response = await supertest(app)
        .delete(`/api/responsaveis/${tempResponsavel.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should return 404 for non-existent responsavel', async () => {
      await supertest(app)
        .delete('/api/responsaveis/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 409 for responsavel with children', async () => {
      await supertest(app)
        .delete(`/api/responsaveis/${testResponsavelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(409);
    });
  });
});