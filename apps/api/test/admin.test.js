const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server.js');
const { createTestAdmin, getAuthToken } = require('./helpers/testHelpers');

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
      .send({
        email: testAdmin.email,
        senha: 'senha123'
      });

    authToken = authResponse.body.data.token || authResponse.headers['authorization'];
  });

  after(async () => {
    // Limpar dados de teste se necessário
  });

  describe('GET /api/admins', () => {
    it('should return list of admins with pagination', async () => {
      const response = await supertest(app)
        .get('/api/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('data');
      expect(response.body.data).to.have.property('pagination');
    });

    it('should return simplified format when simple=true', async () => {
      const response = await supertest(app)
        .get('/api/admins?simple=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).to.be.an('array');
      expect(response.body.data[0]).to.have.all.keys('id', 'nome', 'email');
    });

    it('should search admins by name or email', async () => {
      const response = await supertest(app)
        .get('/api/admins?search=Teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.data).to.be.an('array');
    });
  });

  describe('GET /api/admins/statistics', () => {
    it('should return admin statistics', async () => {
      const response = await supertest(app)
        .get('/api/admins/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('totalAdmins');
      expect(response.body.data).to.have.property('adminsRecentes');
    });
  });

  describe('GET /api/admins/dashboard', () => {
    it('should return dashboard data', async () => {
      const response = await supertest(app)
        .get('/api/admins/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('administradores');
      expect(response.body.data).to.have.property('responsaveis');
      expect(response.body.data).to.have.property('criancas');
      expect(response.body.data).to.have.property('turmas');
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
      expect(response.body.data).to.have.property('nome');
      expect(response.body.data).to.have.property('email');
    });

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
  });

  describe('POST /api/admins', () => {
    it('should create a new admin', async () => {
      const newAdmin = {
        nome: 'Novo Admin',
        email: `novo.admin${Date.now()}@test.com`,
        senha: 'senha123'
      };

      const response = await supertest(app)
        .post('/api/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newAdmin)
        .expect(201);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id');
      expect(response.body.data).to.have.property('nome', newAdmin.nome);
      expect(response.body.data).to.have.property('email', newAdmin.email);
    });

    it('should return 400 for invalid data', async () => {
      const invalidAdmin = {
        nome: 'A', // Nome muito curto
        email: 'invalid-email',
        senha: '123' // Senha muito curta
      };

      await supertest(app)
        .post('/api/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidAdmin)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const duplicateAdmin = {
        nome: 'Admin Duplicado',
        email: testAdmin.email, // Email já existente
        senha: 'senha123'
      };

      await supertest(app)
        .post('/api/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateAdmin)
        .expect(409);
    });
  });

  describe('POST /api/admins/authenticate', () => {
    it('should authenticate admin with valid credentials', async () => {
      const response = await supertest(app)
        .post('/api/admins/authenticate')
        .send({
          email: testAdmin.email,
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
        .post('/api/admins/authenticate')
        .send({
          email: testAdmin.email,
          senha: 'senha-errada'
        })
        .expect(401);
    });

    it('should return 400 for missing credentials', async () => {
      await supertest(app)
        .post('/api/admins/authenticate')
        .send({
          email: testAdmin.email
          // senha faltando
        })
        .expect(400);
    });
  });

  describe('POST /api/admins/:id/change-password', () => {
    it('should change password with valid current password', async () => {
      const response = await supertest(app)
        .post(`/api/admins/${testAdminId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senhaAtual: 'senha123',
          novaSenha: 'novaSenha123'
        })
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should return 400 for incorrect current password', async () => {
      await supertest(app)
        .post(`/api/admins/${testAdminId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senhaAtual: 'senha-errada',
          novaSenha: 'novaSenha123'
        })
        .expect(400);
    });

    it('should return 400 for invalid new password', async () => {
      await supertest(app)
        .post(`/api/admins/${testAdminId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senhaAtual: 'senha123',
          novaSenha: '123' // Senha muito curta
        })
        .expect(400);
    });
  });

  describe('PUT /api/admins/:id', () => {
    it('should update admin with valid data', async () => {
      const updateData = {
        nome: 'Admin Atualizado',
        email: `atualizado${Date.now()}@test.com`
      };

      const response = await supertest(app)
        .put(`/api/admins/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('nome', updateData.nome);
      expect(response.body.data).to.have.property('email', updateData.email);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        nome: 'A', // Nome muito curto
        email: 'invalid-email'
      };

      await supertest(app)
        .put(`/api/admins/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      // Primeiro cria outro admin
      const anotherAdmin = await createTestAdmin({
        email: `outro${Date.now()}@test.com`
      });

      // Tenta atualizar com email duplicado
      await supertest(app)
        .put(`/api/admins/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Teste',
          email: anotherAdmin.email // Email já em uso
        })
        .expect(409);
    });
  });

  describe('DELETE /api/admins/:id', () => {
    it('should delete admin', async () => {
      // Cria um admin temporário para deletar
      const tempAdmin = await createTestAdmin({
        email: `temp${Date.now()}@test.com`
      });

      const response = await supertest(app)
        .delete(`/api/admins/${tempAdmin.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
    });

    it('should return 404 for non-existent admin', async () => {
      await supertest(app)
        .delete('/api/admins/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 409 when trying to delete last admin', async () => {
      // Este teste depende da sua lógica de negócio
      // Você pode precisar mockar a verificação do último admin
      await supertest(app)
        .delete(`/api/admins/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(409); // Ou o código de erro apropriado
    });
  });
});