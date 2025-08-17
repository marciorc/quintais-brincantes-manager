// apps/api/src/adminjs/config.js
const AdminJS = require('adminjs');
const path = require('path');

// 1. Configurações de Branding (logo, cores, etc.)
const brandingOptions = {
  companyName: 'Quintais Brincantes',
  logo: path.join(__dirname, 'assets/logo.png'), // Caminho absoluto
  theme: {
    colors: {
      primary100: '#6a4c93', // Roxo principal
      primary80: '#7d5fa6',
      hoverBg: '#f8f5ff',    // Cor ao passar o mouse
    }
  }
};

// 2. Configurações do Template de Login
const loginTemplateOptions = {
  auth: {
    authenticate: async (email, password) => {
      // Sua lógica de autenticação aqui
      if (email === 'admin@quintais.com' && password === 'senha123') {
        return { email: 'admin@quintais.com' };
      }
      return null;
    }
  },
  cookiePassword: 'sua-chave-secreta', // Chave para cookies
  loginPath: '/admin/login',            // Rota de login
};

// 3. Exporte as configurações
module.exports = {
  brandingOptions,
  loginTemplateOptions
};