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

  // Verifique a estrutura real da resposta
  if (response.body.data && response.body.data.token) {
    return response.body.data.token;
  } else if (response.headers['authorization']) {
    return response.headers['authorization'].replace('Bearer ', '');
  } else if (response.body.token) {
    return response.body.token;
  } else {
    console.log('Estrutura da resposta:', response.body);
    throw new Error('Token não encontrado na resposta');
  }
};


module.exports = {
  createTestAdmin,
  getAuthToken
};