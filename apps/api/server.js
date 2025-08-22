const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

// Importar rotas
const responsavelRoutes = require('./routes/responsavelRoutes');
const criancaRoutes = require('./routes/criancaRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));

// CORS - permitir todas as origens
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Quintais Brincantes está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/responsaveis', responsavelRoutes);
app.use('/api/criancas', criancaRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/admins', adminRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado!'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check em http://localhost:${PORT}/health`);
});

module.exports = app;

