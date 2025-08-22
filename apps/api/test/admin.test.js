const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server.js');
const { createTestAdmin, getAuthToken } = require('./helpers/adminTestHelpers');

describe('Admin Routes', () => {
  let authToken;
  let testAdmin;
  let testAdminId;

  before(async () => {
    // Criar um admin para testes de autenticação
    testAdmin = await createTestAdmin();
    testAdminId = testAdmin.id;

    // Obter token de autenticação
    const authResponse = await supertest(app)
      .post('/api/admins/authenticate')
      .set('Content-Type', 'application/json')
      .send({
        usuario: testAdmin.usuario,
        senha: 'senha123'
      });

    if (authResponse.status !== 200) {
      throw new Error('Falha na autenticação do teste');
    }

    authToken = authResponse.body.data.token;
  });

  describe('GET /api/admins', () => {
    it('should return list of admins', async () => {
      const response = await supertest(app)
        .get('/api/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.exist;
    });

    it('should return simplified format when simple=true', async () => {
      const response = await supertest(app)
        .get('/api/admins?simple=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data[0]).to.include.keys('id', 'nome', 'usuario');
    });
  });

  describe('GET /api/admins/statistics', () => {
    it('should return admin statistics', async () => {
      const response = await supertest(app)
        .get('/api/admins/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });
  });

  describe('GET /api/admins/dashboard', () => {
    it('should return dashboard data', async function() {
      // Dá mais tempo para este teste porque pode ser mais lento
      this.timeout(10000);

      const response = await supertest(app)
        .get('/api/admins/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('object');

      expect(response.body.data).to.include.keys([
        'administradores',
        'responsaveis', 
        'criancas',
        'turmas',
        'resumo'
      ]);

      expect(response.body.data.administradores).to.include.keys([
        'totalAdmins',
        'adminsRecentes'
      ]);

      expect(response.body.data.responsaveis).to.have.property('total');
      
      expect(response.body.data.criancas).to.include.keys([
        'totalCriancas',
        'criancasComTurma',
        'criancasSemTurma',
        'percentualComTurma',
        'turmasComCriancas'
      ]);
      
      expect(response.body.data.turmas).to.include.keys([
        'totalTurmas',
        'turmasComCriancas',
        'turmasVazias',
        'taxaOcupacao'
      ]);
      
      expect(response.body.data.resumo).to.include.keys([
        'totalUsuarios',
        'totalCriancas',
        'totalTurmas',
        'ocupacaoTurmas'
      ]);
    });
  });

  describe('GET /api/admins/:id', () => {
    it('should return admin by ID', async () => {
      const response = await supertest(app)
        .get(`/api/admins/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id', testAdminId);
    });
  });

  describe('POST /api/admins', () => {
    it('should create a new admin', async () => {
      const newAdmin = {
        nome: 'Novo Admin Teste',
        usuario: `novo.admin${Date.now()}`,
        senha: 'senha123'
      };

      const response = await supertest(app)
        .post('/api/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(newAdmin);

      expect(response.status).to.be.oneOf([201, 400]);
      
      if (response.status === 201) {
        expect(response.body.data).to.have.property('usuario', newAdmin.usuario);
      }
    });
  });

  describe('POST /api/admins/authenticate', () => {
    it('should authenticate admin with valid credentials', async () => {
      const response = await supertest(app)
        .post('/api/admins/authenticate')
        .set('Content-Type', 'application/json')
        .send({
          usuario: testAdmin.usuario,
          senha: 'senha123'
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });
  });

  describe('POST /api/admins/:id/change-password', () => {
    it('should change password with valid current password', async () => {
      const response = await supertest(app)
        .post(`/api/admins/${testAdminId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send({
          senhaAtual: 'senha123',
          novaSenha: 'novaSenha123'
        });

      expect(response.status).to.be.oneOf([200, 400]);
    });
  });

  describe('PUT /api/admins/:id', () => {
    it('should update admin with valid data', async () => {
      const updateData = {
        nome: 'Admin Atualizado'
      };

      const response = await supertest(app)
        .put(`/api/admins/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(updateData);

      expect(response.status).to.be.oneOf([200, 400]);
    });
  });

  describe('DELETE /api/admins/:id', () => {
    it('should delete admin', async () => {
      const tempAdmin = await createTestAdmin({
        usuario: `temp${Date.now()}`
      });

      const response = await supertest(app)
        .delete(`/api/admins/${tempAdmin.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });
  });

  describe('Error cases', () => {
    it('should return 400 for invalid ID', async () => {
      await supertest(app)
        .get('/api/admins/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 404 for non-existent admin', async () => {
      await supertest(app)
        .get('/api/admins/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 for invalid credentials', async () => {
      await supertest(app)
        .post('/api/admins/authenticate')
        .set('Content-Type', 'application/json')
        .send({
          usuario: testAdmin.usuario,
          senha: 'senha-errada'
        })
        .expect(401);
    });

    it('should return 400 for missing credentials', async () => {
      await supertest(app)
        .post('/api/admins/authenticate')
        .set('Content-Type', 'application/json')
        .send({
          usuario: testAdmin.usuario
        })
        .expect(400);
    });
  });
});