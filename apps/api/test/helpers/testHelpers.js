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
  // Cria um admin e obtém token de autenticação
  const admin = await createTestAdmin();
  const response = await supertest(app)
    .post('/api/admins/authenticate')
    .send({
      usuario: admin.usuario,
      senha: 'senha123'
    });
  
  return response.body.data.token || response.headers['authorization'];
};

module.exports = {
  createTestAdmin,
  getAuthToken
};