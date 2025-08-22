const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quintais Brincantes Manager',
      version: '1.0.0',
      description: 'API REST para gestão de Quintais Brincantes - Sistema de gerenciamento de crianças, responsáveis, turmas e administradores'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api.quintaisbrincantes.com',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo do erro'
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva do erro'
            },
            details: {
              type: 'object',
              description: 'Detalhes adicionais do erro'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensagem de sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados'
            }
          }
        },
        Responsavel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do responsável'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do responsável'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do responsável'
            },
            contato: {
              type: 'string',
              description: 'Telefone ou outro meio de contato'
            },
            criancas: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Crianca'
              },
              description: 'Lista de crianças vinculadas ao responsável'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            }
          }
        },
        ResponsavelInput: {
          type: 'object',
          required: ['nome', 'email', 'contato', 'senha'],
          properties: {
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nome completo do responsável'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do responsável'
            },
            contato: {
              type: 'string',
              minLength: 8,
              maxLength: 20,
              description: 'Telefone ou outro meio de contato'
            },
            senha: {
              type: 'string',
              minLength: 6,
              description: 'Senha para acesso ao sistema'
            }
          }
        },
        Crianca: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da criança'
            },
            nome: {
              type: 'string',
              description: 'Nome completo da criança'
            },
            dataNascimento: {
              type: 'string',
              description: 'Data de nascimento da criança'
            },
            turmaId: {
              type: 'integer',
              nullable: true,
              description: 'ID da turma (opcional)'
            },
            turma: {
              $ref: '#/components/schemas/Turma',
              description: 'Dados da turma'
            },
            responsavelId: {
              type: 'integer',
              description: 'ID do responsável'
            },
            responsavel: {
              $ref: '#/components/schemas/Responsavel',
              description: 'Dados do responsável'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            }
          }
        },
        CriancaInput: {
          type: 'object',
          required: ['nome', 'dataNascimento', 'responsavelId'],
          properties: {
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nome completo da criança'
            },
            dataNascimento: {
              type: 'string',
              description: 'Data de nascimento da criança (formato: DD/MM/AAAA)'
            },
            turmaId: {
              type: 'integer',
              nullable: true,
              description: 'ID da turma (opcional)'
            },
            responsavelId: {
              type: 'integer',
              description: 'ID do responsável'
            }
          }
        },
        Turma: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da turma'
            },
            nome: {
              type: 'string',
              description: 'Nome da turma'
            },
            criancas: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Crianca'
              },
              description: 'Lista de crianças na turma'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            }
          }
        },
        TurmaInput: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Nome único da turma'
            }
          }
        },
        Admin: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do administrador'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do administrador'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do administrador'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            }
          }
        },
        AdminInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nome completo do administrador'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do administrador'
            },
            senha: {
              type: 'string',
              minLength: 6,
              description: 'Senha para acesso ao sistema'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;

