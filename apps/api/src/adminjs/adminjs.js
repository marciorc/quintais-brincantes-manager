const { default: AdminJS } = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSPrisma = require('@adminjs/prisma')
const { PrismaClient } = require('@prisma/client')
const path = require('path')
const express = require('express')

const prisma = new PrismaClient()

const DatePicker = require('./components/DatePicker')
const DateDisplay = require('./components/DateDisplay')

AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database
})

const adminJs = new AdminJS({
  resources: [
    { resource: { model: AdminJSPrisma.getModelByName('Admin'), client: prisma },
      options:{
        properties: {
          criadoEm: { isVisible: false },
        }
      }
    },
    { resource: { model: AdminJSPrisma.getModelByName('Crianca'), client: prisma },
      options:{
        properties: {
          dataNascimento: {
            type: 'string',
            components: {
              edit: DatePicker,
              show: DateDisplay
            },
            props: {
              picker: 'date',
              format: 'DD/MM/YYYY',
              showTime: false
            }
          },
          criadoEm: { isVisible: false },
        }
      }
    },
    { resource: { model: AdminJSPrisma.getModelByName('Responsavel'), client: prisma },
      options:{
        properties: {
          criadoEm: { isVisible: false },
        }
      }
    },
    { resource: { model: AdminJSPrisma.getModelByName('Turma'), client: prisma }}
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Quintais Brincantes Manager',
    logo: '/quintais_brincantes_manager_logo.png',
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: '#6a4c93',
        primary80: '#7d5fa6',
        hoverBg: '#f8f5ff'
      }
    }
  },
  assets: {
    styles: ['/admin-login.css']
  }
})

// Autenticação
const authenticate = async (username, password) => {
  const bcrypt = require('bcryptjs');
  try {
    const admin = await prisma.admin.findUnique({ 
      where: { usuario: username }
    });
    
    if (admin && await bcrypt.compare(password, admin.senhaHash)) {
      return admin;
    }
    return null;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null;
  }
};

const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate,
    cookieName: 'adminjs-session',
    cookiePassword: process.env.JWT_SECRET || 'senha-segura-123',
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

module.exports = { adminJs, router }