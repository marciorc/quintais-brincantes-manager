const { default: AdminJS } = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSPrisma = require('@adminjs/prisma')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

AdminJS.registerAdapter({ 
  Resource: AdminJSPrisma.Resource, 
  Database: AdminJSPrisma.Database 
})

const adminJs = new AdminJS({
  resources: [
    {
      resource: {
        model: AdminJSPrisma.getModelByName('Admin'), 
        client: prisma 
      }
    },
    {
      resource: {
        model: AdminJSPrisma.getModelByName('Crianca'), 
        client: prisma 
      }
    },
    {
      resource: {
        model: AdminJSPrisma.getModelByName('Responsavel'), 
        client: prisma 
      }
    },
    {
      resource: {
        model: AdminJSPrisma.getModelByName('Turma'), 
        client: prisma 
      }
    }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Quintais Brincantes Manager',
    logo: '../../static/quintais_brincantes_manager_logo.png',
    theme: {
      colors: {
        // Cores principais (baseadas no #6a4c93 do título)
        primary100: '#a57aff', // Fundo mais claro
        primary80: '#e6d7ff',  // Borda e detalhes
        primary60: '#c9a8ff',  // Hover states
        primary40: '#a57aff',  // Botões e elementos interativos
        primary20: '#6a4c93',  // Textos e elementos principais
        
        // Cores complementares
        accent: '#e6d7ff',     // Destaques suaves
        filterBg: '#f8f5ff',   // Fundo dos filtros
        hoverBg: '#f0e9ff',    // Fundo ao passar mouse
        
        // Textos
        text: '#4a4a4a',       // Cor do texto principal (igual ao site)
        textSecondary: '#6a4c93', // Textos secundários
        
        // Componentes
        border: '#e6d7ff',     // Bordas suaves
        sidebar: '#f8f5ff',    // Barra lateral com fundo claro
        bg: '#ffffff',         // Fundo branco como no site
        
        // Estados
        errorDark: '#d33f49',  // Para mensagens de erro
        successDark: '#3c9d5e', // Para mensagens de sucesso
        infoDark: '#3b7ddd'    // Para mensagens informativas
      },
      // Opcional: se quiser manter a fonte similar
      fonts: {
        fontFamily: 'Arial, sans-serif'
      }
    },
    loginPage: {
      labels: {
        email: 'Username',
        password: 'Sua Senha', // Pode personalizar outros labels também
        button: 'Entrar'
      }
    },
  },
})

// Configuração de autenticação para o AdminJS
const authenticate = async (username, password) => {
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  const prisma = new PrismaClient();
  
  try {
    const admin = await prisma.admin.findUnique({
      where: { usuario: username }
    });
    
    if (admin && await bcrypt.compare(password, admin.senhaHash)) {
      return admin;
    }
    return false;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return false;
  }
};

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate,
  cookieName: 'adminjs',
  cookiePassword: process.env.JWT_SECRET || 'complex-secure-password',
}, null, {
  resave: false,
  saveUninitialized: true,
});

module.exports = { adminJs, router }