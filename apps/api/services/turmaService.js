const { prisma } = require('../config/database');

class TurmaService {
  /**
   * Busca todas as turmas
   * @param {object} options - Opções de busca (include, skip, take, etc.)
   * @returns {Promise<Array>} Lista de turmas
   */
  async findAll(options = {}) {
    const {
      include = { 
        criancas: {
          include: {
            responsavel: { select: { id: true, nome: true, email: true, contato: true } }
          }
        }
      },
      skip = 0,
      take = 50,
      orderBy = { nome: 'asc' }
    } = options;

    return await prisma.turma.findMany({
      include,
      skip,
      take,
      orderBy
    });
  }

  /**
   * Busca turma por ID
   * @param {number} id - ID da turma
   * @param {object} options - Opções de busca
   * @returns {Promise<object|null>} Turma encontrada ou null
   */
  async findById(id, options = {}) {
    const { 
      include = { 
        criancas: {
          include: {
            responsavel: { select: { id: true, nome: true, email: true, contato: true } }
          }
        }
      } 
    } = options;

    return await prisma.turma.findUnique({
      where: { id },
      include
    });
  }

  /**
   * Busca turma por nome
   * @param {string} nome - Nome da turma
   * @param {object} options - Opções de busca
   * @returns {Promise<object|null>} Turma encontrada ou null
   */
  async findByNome(nome, options = {}) {
    const { 
      include = { 
        criancas: {
          include: {
            responsavel: { select: { id: true, nome: true, email: true, contato: true } }
          }
        }
      } 
    } = options;

    return await prisma.turma.findUnique({
      where: { nome },
      include
    });
  }

  /**
   * Cria nova turma
   * @param {object} data - Dados da turma
   * @returns {Promise<object>} Turma criada
   */
  async create(data) {
    // Verifica se nome já existe
    const existingTurma = await prisma.turma.findUnique({
      where: { nome: data.nome }
    });

    if (existingTurma) {
      throw new Error('Já existe uma turma com este nome');
    }

    return await prisma.turma.create({
      data,
      include: {
        criancas: {
          include: {
            responsavel: { select: { id: true, nome: true, email: true, contato: true } }
          }
        }
      }
    });
  }

  /**
   * Atualiza turma
   * @param {number} id - ID da turma
   * @param {object} data - Dados para atualização
   * @returns {Promise<object>} Turma atualizada
   */
  async update(id, data) {
    // Verifica se turma existe
    const existingTurma = await prisma.turma.findUnique({
      where: { id }
    });

    if (!existingTurma) {
      throw new Error('Turma não encontrada');
    }

    // Se está atualizando nome, verifica se não está em uso
    if (data.nome && data.nome !== existingTurma.nome) {
      const nomeInUse = await prisma.turma.findUnique({
        where: { nome: data.nome }
      });

      if (nomeInUse) {
        throw new Error('Já existe uma turma com este nome');
      }
    }

    return await prisma.turma.update({
      where: { id },
      data,
      include: {
        criancas: {
          include: {
            responsavel: { select: { id: true, nome: true, email: true, contato: true } }
          }
        }
      }
    });
  }

  /**
   * Remove turma
   * @param {number} id - ID da turma
   * @returns {Promise<object>} Turma removida
   */
  async delete(id) {
    // Verifica se turma existe
    const existingTurma = await prisma.turma.findUnique({
      where: { id },
      include: { criancas: true }
    });

    if (!existingTurma) {
      throw new Error('Turma não encontrada');
    }

    // Verifica se tem crianças vinculadas
    if (existingTurma.criancas.length > 0) {
      throw new Error('Não é possível remover turma que possui crianças vinculadas');
    }

    return await prisma.turma.delete({
      where: { id }
    });
  }

  /**
   * Remove turma e desvincula crianças
   * @param {number} id - ID da turma
   * @returns {Promise<object>} Resultado da operação
   */
  async deleteAndUnlinkChildren(id) {
    // Verifica se turma existe
    const existingTurma = await prisma.turma.findUnique({
      where: { id },
      include: { criancas: true }
    });

    if (!existingTurma) {
      throw new Error('Turma não encontrada');
    }

    // Usa transação para garantir consistência
    const result = await prisma.$transaction(async (tx) => {
      // Primeiro, desvincula todas as crianças da turma
      await tx.crianca.updateMany({
        where: { turmaId: id },
        data: { turmaId: null }
      });

      // Depois, remove a turma
      const turmaRemovida = await tx.turma.delete({
        where: { id }
      });

      return {
        turma: turmaRemovida,
        criancasDesvinculadas: existingTurma.criancas.length
      };
    });

    return result;
  }

  /**
   * Conta total de turmas
   * @param {object} where - Condições de filtro
   * @returns {Promise<number>} Total de turmas
   */
  async count(where = {}) {
    return await prisma.turma.count({ where });
  }

  /**
   * Busca turmas com paginação
   * @param {object} params - Parâmetros de paginação e filtro
   * @returns {Promise<object>} Resultado paginado
   */
  async findWithPagination(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      include = { 
        criancas: {
          include: {
            responsavel: { select: { id: true, nome: true, email: true, contato: true } }
          }
        }
      }
    } = params;

    const skip = (page - 1) * limit;
    const where = search ? {
      nome: { contains: search, mode: 'insensitive' }
    } : {};

    const [turmas, total] = await Promise.all([
      prisma.turma.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: { nome: 'asc' }
      }),
      prisma.turma.count({ where })
    ]);

    return {
      data: turmas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Busca turmas simples (apenas id e nome)
   * @returns {Promise<Array>} Lista simplificada de turmas
   */
  async findSimple() {
    return await prisma.turma.findMany({
      select: {
        id: true,
        nome: true,
        _count: {
          select: { criancas: true }
        }
      },
      orderBy: { nome: 'asc' }
    });
  }

  /**
   * Adiciona crianças à turma
   * @param {number} turmaId - ID da turma
   * @param {Array} criancaIds - IDs das crianças
   * @returns {Promise<object>} Resultado da operação
   */
  async addCriancas(turmaId, criancaIds) {
    // Verifica se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Verifica se todas as crianças existem
    const criancas = await prisma.crianca.findMany({
      where: { id: { in: criancaIds } }
    });

    if (criancas.length !== criancaIds.length) {
      throw new Error('Uma ou mais crianças não foram encontradas');
    }

    const result = await prisma.crianca.updateMany({
      where: { id: { in: criancaIds } },
      data: { turmaId }
    });

    return {
      count: result.count,
      message: `${result.count} criança(s) adicionada(s) à turma com sucesso`
    };
  }

  /**
   * Remove crianças da turma
   * @param {number} turmaId - ID da turma
   * @param {Array} criancaIds - IDs das crianças
   * @returns {Promise<object>} Resultado da operação
   */
  async removeCriancas(turmaId, criancaIds) {
    // Verifica se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const result = await prisma.crianca.updateMany({
      where: { 
        id: { in: criancaIds },
        turmaId: turmaId
      },
      data: { turmaId: null }
    });

    return {
      count: result.count,
      message: `${result.count} criança(s) removida(s) da turma com sucesso`
    };
  }

  /**
   * Busca estatísticas das turmas
   * @returns {Promise<object>} Estatísticas
   */
  async getStatistics() {
    const [
      totalTurmas,
      turmasComCriancas,
      turmasVazias,
      mediaCriancasPorTurma
    ] = await Promise.all([
      prisma.turma.count(),
      prisma.turma.count({ where: { criancas: { some: {} } } }),
      prisma.turma.count({ where: { criancas: { none: {} } } }),
      prisma.turma.aggregate({
        _avg: {
          criancas: true
        }
      })
    ]);

    return {
      totalTurmas,
      turmasComCriancas,
      turmasVazias,
      mediaCriancasPorTurma: Math.round(mediaCriancasPorTurma._avg.criancas || 0)
    };
  }
}

module.exports = new TurmaService();

