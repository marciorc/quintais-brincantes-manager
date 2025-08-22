const Joi = require('joi');

// Schemas de validação para Responsavel
const responsavelSchemas = {
  create: Joi.object({
    nome: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'string.empty': 'Email é obrigatório'
    }),
    contato: Joi.string().min(8).max(20).required().messages({
      'string.empty': 'Contato é obrigatório',
      'string.min': 'Contato deve ter pelo menos 8 caracteres',
      'string.max': 'Contato deve ter no máximo 20 caracteres'
    }),
    senha: Joi.string().min(6).required().messages({
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    })
  }),
  
  update: Joi.object({
    nome: Joi.string().min(2).max(100).messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Email deve ter um formato válido'
    }),
    contato: Joi.string().min(8).max(20).messages({
      'string.min': 'Contato deve ter pelo menos 8 caracteres',
      'string.max': 'Contato deve ter no máximo 20 caracteres'
    }),
    senha: Joi.string().min(6).messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    })
  }).min(1)
};

// Schemas de validação para Crianca
const criancaSchemas = {
  create: Joi.object({
    nome: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    dataNascimento: Joi.string().required().messages({
      'string.empty': 'Data de nascimento é obrigatória'
    }),
    turmaId: Joi.number().integer().positive().allow(null).messages({
      'number.base': 'ID da turma deve ser um número',
      'number.integer': 'ID da turma deve ser um número inteiro',
      'number.positive': 'ID da turma deve ser positivo'
    }),
    responsavelId: Joi.number().integer().positive().required().messages({
      'number.base': 'ID do responsável deve ser um número',
      'number.integer': 'ID do responsável deve ser um número inteiro',
      'number.positive': 'ID do responsável deve ser positivo',
      'any.required': 'ID do responsável é obrigatório'
    })
  }),
  
  update: Joi.object({
    nome: Joi.string().min(2).max(100).messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    dataNascimento: Joi.string(),
    turmaId: Joi.number().integer().positive().allow(null).messages({
      'number.base': 'ID da turma deve ser um número',
      'number.integer': 'ID da turma deve ser um número inteiro',
      'number.positive': 'ID da turma deve ser positivo'
    }),
    responsavelId: Joi.number().integer().positive().messages({
      'number.base': 'ID do responsável deve ser um número',
      'number.integer': 'ID do responsável deve ser um número inteiro',
      'number.positive': 'ID do responsável deve ser positivo'
    })
  }).min(1)
};

// Schemas de validação para Turma
const turmaSchemas = {
  create: Joi.object({
    nome: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 50 caracteres'
    })
  }),
  
  update: Joi.object({
    nome: Joi.string().min(2).max(50).messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 50 caracteres'
    })
  }).min(1)
};

// Schemas de validação para Admin
const adminSchemas = {
  create: Joi.object({
    nome: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'string.empty': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).required().messages({
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    })
  }),
  
  update: Joi.object({
    nome: Joi.string().min(2).max(100).messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Email deve ter um formato válido'
    }),
    senha: Joi.string().min(6).messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    })
  }).min(1)
};

// Schema para validação de ID
const idSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'ID deve ser um número',
  'number.integer': 'ID deve ser um número inteiro',
  'number.positive': 'ID deve ser positivo',
  'any.required': 'ID é obrigatório'
});

// Middleware de validação
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os dados fornecidos não atendem aos critérios de validação',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Middleware de validação de ID
const validateId = (req, res, next) => {
  const { error } = idSchema.validate(parseInt(req.params.id));
  
  if (error) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'O ID fornecido não é válido',
      details: error.details.map(detail => ({
        field: 'id',
        message: detail.message
      }))
    });
  }
  
  req.params.id = parseInt(req.params.id);
  next();
};

module.exports = {
  responsavelSchemas,
  criancaSchemas,
  turmaSchemas,
  adminSchemas,
  validate,
  validateId
};

