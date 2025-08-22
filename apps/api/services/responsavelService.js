const { prisma } = require('../config/database');
const bcrypt = require('bcrypt');
const { hashPassword, comparePassword, sanitizeObject, sanitizeArray } = require('../utils/helpers');

class ResponsavelService {
  /**
   * Busca todos os responsáveis
   * @param {object} options - Opções de busca (include, skip, take, etc.)
   * @returns {Promise<Array>} Lista de responsáveis
   */
  async findAll(options = {}) {
    const {
      include = { criancas: true },
      skip = 0,
      take = 50,
      orderBy = { criadoEm: 'desc' }
    } = options;

    const responsaveis = await prisma.responsavel.findMany({
      include,
      skip,
      take,
      orderBy
    });

    return sanitizeArray(responsaveis);
  }

  /**
   * Busca responsável por ID
   * @param {number} id - ID do responsável
   * @param {object} options - Opções de busca
   * @returns {Promise<object|null>} Responsável encontrado ou null
   */
  async findById(id, options = {}) {
    const { include = { criancas: true } } = options;

    const responsavel = await prisma.responsavel.findUnique({
      where: { id },
      include
    });

    return responsavel ? sanitizeObject(responsavel) : null;
  }

  /**
   * Busca responsável por email
   * @param {string} email - Email do responsável
   * @param {object} options - Opções de busca
   * @returns {Promise<object|null>} Responsável encontrado ou null
   */
  async findByEmail(email, options = {}) {
    const { include = { criancas: true } } = options;

    const responsavel = await prisma.responsavel.findUnique({
      where: { email },
      include
    });

    return responsavel ? sanitizeObject(responsavel) : null;
  }

  /**
   * Cria novo responsável
   * @param {object} data - Dados do responsável
   * @returns {Promise<object>} Responsável criado
   */
  async create(data) {
    try {
      const { senha, ...responsavelData } = data;
      
      // Verifica se email já existe
      const existingResponsavel = await prisma.responsavel.findFirst({
        where: {
          email: responsavelData.email
        }
      });

      if (existingResponsavel) {
        throw new Error('Email já está em uso');
      }

      // Hash da senha
      const saltRounds = 12;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      const responsavel = await prisma.responsavel.create({
        data: {
          ...responsavelData,
          senhaHash
        }
      });

      return responsavel;
    } catch (error) {
      console.error('Erro ao criar responsável:', error);
      throw error;
    }
  }

  /**
   * Atualiza responsável
   * @param {number} id - ID do responsável
   * @param {object} data - Dados para atualização
   * @returns {Promise<object>} Responsável atualizado
   */
  async update(id, data) {
    // Verifica se responsável existe
    const existingResponsavel = await prisma.responsavel.findUnique({
      where: { id }
    });

    if (!existingResponsavel) {
      throw new Error('Responsável não encontrado');
    }

    const updateData = { ...data };

    // Se está atualizando email, verifica se não está em uso
    if (data.email && data.email !== existingResponsavel.email) {
      const emailInUse = await prisma.responsavel.findUnique({
        where: { email: data.email }
      });

      if (emailInUse) {
        throw new Error('Email já está em uso');
      }
    }

    // Se está atualizando senha, gera novo hash
    if (data.senha) {
      updateData.senhaHash = await hashPassword(data.senha);
      delete updateData.senha;
    }

    const responsavel = await prisma.responsavel.update({
      where: { id },
      data: updateData,
      include: {
        criancas: true
      }
    });

    return sanitizeObject(responsavel);
  }

  /**
   * Remove responsável
   * @param {number} id - ID do responsável
   * @returns {Promise<object>} Responsável removido
   */
  async delete(id) {
    // Verifica se responsável existe
    const existingResponsavel = await prisma.responsavel.findUnique({
      where: { id },
      include: { criancas: true }
    });

    if (!existingResponsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Verifica se tem crianças vinculadas
    if (existingResponsavel.criancas.length > 0) {
      throw new Error('Não é possível remover responsável que possui crianças vinculadas');
    }

    const responsavel = await prisma.responsavel.delete({
      where: { id }
    });

    return sanitizeObject(responsavel);
  }

  /**
   * Autentica responsável
   * @param {string} email - Email do responsável
   * @param {string} senha - Senha do responsável
   * @returns {Promise<object|null>} Responsável autenticado ou null
   */
  async authenticate(email, senha) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { email },
      include: { criancas: true }
    });

    if (!responsavel) {
      return null;
    }

    const senhaValida = await comparePassword(senha, responsavel.senhaHash);

    if (!senhaValida) {
      return null;
    }

    return sanitizeObject(responsavel);
  }

  /**
   * Conta total de responsáveis
   * @param {object} where - Condições de filtro
   * @returns {Promise<number>} Total de responsáveis
   */
  async count(where = {}) {
    return await prisma.responsavel.count({ where });
  }

  /**
   * Busca responsáveis com paginação
   * @param {object} params - Parâmetros de paginação e filtro
   * @returns {Promise<object>} Resultado paginado
   */
  async findWithPagination(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      include = { criancas: true }
    } = params;

    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [responsaveis, total] = await Promise.all([
      prisma.responsavel.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: { criadoEm: 'desc' }
      }),
      prisma.responsavel.count({ where })
    ]);

    return {
      data: sanitizeArray(responsaveis),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ResponsavelService();