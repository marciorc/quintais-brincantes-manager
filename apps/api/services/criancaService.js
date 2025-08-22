const { prisma } = require('../config/database');

class CriancaService {
  /**
   * Busca todas as crianças
   * @param {object} options - Opções de busca (include, skip, take, etc.)
   * @returns {Promise<Array>} Lista de crianças
   */
  async findAll(options = {}) {
    const {
      include = { 
        responsavel: { select: { id: true, nome: true, email: true, contato: true } },
        turma: true 
      },
      skip = 0,
      take = 50,
      orderBy = { criadoEm: 'desc' }
    } = options;

    return await prisma.crianca.findMany({
      include,
      skip,
      take,
      orderBy
    });
  }

  /**
   * Busca criança por ID
   * @param {number} id - ID da criança
   * @param {object} options - Opções de busca
   * @returns {Promise<object|null>} Criança encontrada ou null
   */
  async findById(id, options = {}) {
    const { 
      include = { 
        responsavel: { select: { id: true, nome: true, email: true, contato: true } },
        turma: true 
      } 
    } = options;

    return await prisma.crianca.findUnique({
      where: { id },
      include
    });
  }

  /**
   * Busca crianças por responsável
   * @param {number} responsavelId - ID do responsável
   * @param {object} options - Opções de busca
   * @returns {Promise<Array>} Lista de crianças do responsável
   */
  async findByResponsavel(responsavelId, options = {}) {
    const { 
      include = { turma: true },
      orderBy = { nome: 'asc' }
    } = options;

    return await prisma.crianca.findMany({
      where: { responsavelId },
      include,
      orderBy
    });
  }

  /**
   * Busca crianças por turma
   * @param {number} turmaId - ID da turma
   * @param {object} options - Opções de busca
   * @returns {Promise<Array>} Lista de crianças da turma
   */
  async findByTurma(turmaId, options = {}) {
    const { 
      include = { 
        responsavel: { select: { id: true, nome: true, email: true, contato: true } }
      },
      orderBy = { nome: 'asc' }
    } = options;

    return await prisma.crianca.findMany({
      where: { turmaId },
      include,
      orderBy
    });
  }

  /**
   * Cria nova criança
   * @param {object} data - Dados da criança
   * @returns {Promise<object>} Criança criada
   */
  async create(data) {
    // Verifica se responsável existe
    const responsavel = await prisma.responsavel.findUnique({
      where: { id: data.responsavelId }
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Verifica se turma existe (se fornecida)
    if (data.turmaId) {
      const turma = await prisma.turma.findUnique({
        where: { id: data.turmaId }
      });

      if (!turma) {
        throw new Error('Turma não encontrada');
      }
    }

    return await prisma.crianca.create({
      data,
      include: {
        responsavel: { select: { id: true, nome: true, email: true, contato: true } },
        turma: true
      }
    });
  }

  /**
   * Atualiza criança
   * @param {number} id - ID da criança
   * @param {object} data - Dados para atualização
   * @returns {Promise<object>} Criança atualizada
   */
  async update(id, data) {
    // Verifica se criança existe
    const existingCrianca = await prisma.crianca.findUnique({
      where: { id }
    });

    if (!existingCrianca) {
      throw new Error('Criança não encontrada');
    }

    // Verifica se responsável existe (se fornecido)
    if (data.responsavelId) {
      const responsavel = await prisma.responsavel.findUnique({
        where: { id: data.responsavelId }
      });

      if (!responsavel) {
        throw new Error('Responsável não encontrado');
      }
    }

    // Verifica se turma existe (se fornecida)
    if (data.turmaId) {
      const turma = await prisma.turma.findUnique({
        where: { id: data.turmaId }
      });

      if (!turma) {
        throw new Error('Turma não encontrada');
      }
    }

    return await prisma.crianca.update({
      where: { id },
      data,
      include: {
        responsavel: { select: { id: true, nome: true, email: true, contato: true } },
        turma: true
      }
    });
  }

  /**
   * Remove criança
   * @param {number} id - ID da criança
   * @returns {Promise<object>} Criança removida
   */
  async delete(id) {
    // Verifica se criança existe
    const existingCrianca = await prisma.crianca.findUnique({
      where: { id }
    });

    if (!existingCrianca) {
      throw new Error('Criança não encontrada');
    }

    return await prisma.crianca.delete({
      where: { id }
    });
  }

  /**
   * Conta total de crianças
   * @param {object} where - Condições de filtro
   * @returns {Promise<number>} Total de crianças
   */
  async count(where = {}) {
    return await prisma.crianca.count({ where });
  }

  /**
   * Busca crianças com paginação
   * @param {object} params - Parâmetros de paginação e filtro
   * @returns {Promise<object>} Resultado paginado
   */
  async findWithPagination(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      responsavelId = null,
      turmaId = null,
      include = { 
        responsavel: { select: { id: true, nome: true, email: true, contato: true } },
        turma: true 
      }
    } = params;

    const skip = (page - 1) * limit;
    const where = {};

    // Filtro por busca
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { dataNascimento: { contains: search } }
      ];
    }

    // Filtro por responsável
    if (responsavelId) {
      where.responsavelId = responsavelId;
    }

    // Filtro por turma
    if (turmaId) {
      where.turmaId = turmaId;
    }

    const [criancas, total] = await Promise.all([
      prisma.crianca.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: { nome: 'asc' }
      }),
      prisma.crianca.count({ where })
    ]);

    return {
      data: criancas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Atualiza turma de múltiplas crianças
   * @param {Array} criancaIds - IDs das crianças
   * @param {number|null} turmaId - ID da nova turma ou null para remover
   * @returns {Promise<object>} Resultado da operação
   */
  async updateTurmaMultiple(criancaIds, turmaId) {
    // Verifica se turma existe (se fornecida)
    if (turmaId) {
      const turma = await prisma.turma.findUnique({
        where: { id: turmaId }
      });

      if (!turma) {
        throw new Error('Turma não encontrada');
      }
    }

    const result = await prisma.crianca.updateMany({
      where: {
        id: { in: criancaIds }
      },
      data: {
        turmaId
      }
    });

    return {
      count: result.count,
      message: `${result.count} criança(s) atualizada(s) com sucesso`
    };
  }

  /**
   * Busca estatísticas das crianças
   * @returns {Promise<object>} Estatísticas
   */
  async getStatistics() {
    const [
      totalCriancas,
      criancasComTurma,
      criancasSemTurma,
      turmasComCriancas
    ] = await Promise.all([
      prisma.crianca.count(),
      prisma.crianca.count({ where: { turmaId: { not: null } } }),
      prisma.crianca.count({ where: { turmaId: null } }),
      prisma.turma.count({ where: { criancas: { some: {} } } })
    ]);

    return {
      totalCriancas,
      criancasComTurma,
      criancasSemTurma,
      turmasComCriancas,
      percentualComTurma: totalCriancas > 0 ? Math.round((criancasComTurma / totalCriancas) * 100) : 0
    };
  }
}

module.exports = new CriancaService();

