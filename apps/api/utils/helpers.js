const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Gera hash da senha
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara senha com hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash da senha
 * @returns {Promise<boolean>} True se a senha confere
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Gera token JWT
 * @param {object} payload - Dados para incluir no token
 * @param {string} expiresIn - Tempo de expiração (ex: '24h', '7d')
 * @returns {string} Token JWT
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verifica token JWT
 * @param {string} token - Token JWT
 * @returns {object} Payload decodificado
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Formata resposta de sucesso
 * @param {object} res - Objeto response do Express
 * @param {number} statusCode - Código de status HTTP
 * @param {string} message - Mensagem de sucesso
 * @param {object} data - Dados a serem retornados
 */
const successResponse = (res, statusCode = 200, message = 'Operação realizada com sucesso', data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Formata resposta de erro
 * @param {object} res - Objeto response do Express
 * @param {number} statusCode - Código de status HTTP
 * @param {string} error - Tipo do erro
 * @param {string} message - Mensagem de erro
 * @param {object} details - Detalhes adicionais do erro
 */
const errorResponse = (res, statusCode = 500, error = 'Erro interno', message = 'Ocorreu um erro inesperado', details = null) => {
  const response = {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details !== null) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Remove campos sensíveis de um objeto
 * @param {object} obj - Objeto a ser sanitizado
 * @param {array} fieldsToRemove - Campos a serem removidos
 * @returns {object} Objeto sanitizado
 */
const sanitizeObject = (obj, fieldsToRemove = ['senhaHash', 'senha']) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  
  fieldsToRemove.forEach(field => {
    delete sanitized[field];
  });
  
  return sanitized;
};

/**
 * Remove campos sensíveis de um array de objetos
 * @param {array} array - Array de objetos a serem sanitizados
 * @param {array} fieldsToRemove - Campos a serem removidos
 * @returns {array} Array sanitizado
 */
const sanitizeArray = (array, fieldsToRemove = ['senhaHash', 'senha']) => {
  if (!Array.isArray(array)) return array;
  
  return array.map(item => sanitizeObject(item, fieldsToRemove));
};

/**
 * Converte string para formato de título (primeira letra maiúscula)
 * @param {string} str - String a ser convertida
 * @returns {string} String formatada
 */
const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se o email é válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Gera código aleatório
 * @param {number} length - Tamanho do código
 * @returns {string} Código gerado
 */
const generateRandomCode = (length = 6) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Formata data para o padrão brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada (DD/MM/AAAA)
 */
const formatDateToBR = (date) => {
  if (!date) return null;
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return null;
  
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Converte data do formato brasileiro para ISO
 * @param {string} dateStr - Data no formato DD/MM/AAAA
 * @returns {Date|null} Objeto Date ou null se inválida
 */
const parseBRDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  const parts = dateStr.split('/');
  
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  
  // Verifica se a data é válida
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  successResponse,
  errorResponse,
  sanitizeObject,
  sanitizeArray,
  toTitleCase,
  isValidEmail,
  generateRandomCode,
  formatDateToBR,
  parseBRDate
};

