const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Middleware para conectar ao banco
const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados PostgreSQL');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

// Middleware para desconectar do banco
const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Desconectado do banco de dados');
  } catch (error) {
    console.error('❌ Erro ao desconectar do banco de dados:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Encerrando aplicação...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Encerrando aplicação...');
  await disconnectDatabase();
  process.exit(0);
});

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase
};

