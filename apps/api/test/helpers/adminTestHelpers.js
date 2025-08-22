const supertest = require('supertest');
const app = require('../../server.js');
const adminService = require('../../services/adminService');

const createTestAdmin = async (adminData = {}) => {
  const defaultData = {
    nome: 'Admin Teste',
    usuario: `admin${Date.now()}`,
    senha: 'senha123'
  };

  return await adminService.create({ ...defaultData, ...adminData });
};

const getAuthToken = async () => {
  const admin = await createTestAdmin();
  const response = await supertest(app)
    .post('/api/admins/authenticate')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      usuario: admin.usuario,
      senha: 'senha123'
    });
};


module.exports = {
  createTestAdmin,
  getAuthToken
};