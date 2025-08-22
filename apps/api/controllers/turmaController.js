const turmaService = require('../services/turmaService');
const { successResponse, errorResponse } = require('../utils/helpers');

class TurmaController {
  /**
   * Lista todas as turmas
   */
  async index(req, res) {
    try {
      const { page, limit, search, simple } = req.query;
      
      // Se solicitado formato simples
      if (simple === 'true') {
        const turmas = await turmaService.findSimple();
        return successResponse(res, 200, 'Turmas encontradas com sucesso', turmas);
      }
      
      if (page || limit || search) {
        const result = await turmaService.findWithPagination({
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          search: search || ''
        });
        
        return successResponse(res, 200, 'Turmas encontradas com sucesso', result);
      }

      const turmas = await turmaService.findAll();
      return successResponse(res, 200, 'Turmas encontradas com sucesso', turmas);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar turmas');
    }
  }

  /**
   * Busca turma por ID
   */
  async show(req, res) {
    try {
      const { id } = req.params;
      const turma = await turmaService.findById(id);

      if (!turma) {
        return errorResponse(res, 404, 'Não encontrado', 'Turma não encontrada');
      }

      return successResponse(res, 200, 'Turma encontrada com sucesso', turma);
    } catch (error) {
      console.error('Erro ao buscar turma:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar turma');
    }
  }

  /**
   * Cria nova turma
   */
  async store(req, res) {
    try {
      const turma = await turmaService.create(req.body);
      return successResponse(res, 201, 'Turma criada com sucesso', turma);
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      
      if (error.message === 'Já existe uma turma com este nome') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao criar turma');
    }
  }

  /**
   * Atualiza turma
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const turma = await turmaService.update(id, req.body);
      
      return successResponse(res, 200, 'Turma atualizada com sucesso', turma);
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      
      if (error.message === 'Turma não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Já existe uma turma com este nome') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao atualizar turma');
    }
  }

  /**
   * Remove turma
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const { force } = req.query;
      
      if (force === 'true') {
        // Remove turma e desvincula crianças
        const result = await turmaService.deleteAndUnlinkChildren(id);
        return successResponse(res, 200, 'Turma removida e crianças desvinculadas com sucesso', result);
      } else {
        // Remove turma apenas se não tiver crianças
        await turmaService.delete(id);
        return successResponse(res, 200, 'Turma removida com sucesso');
      }
    } catch (error) {
      console.error('Erro ao remover turma:', error);
      
      if (error.message === 'Turma não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Não é possível remover turma que possui crianças vinculadas') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao remover turma');
    }
  }

  /**
   * Adiciona crianças à turma
   */
  async addCriancas(req, res) {
    try {
      const { id } = req.params;
      const { criancaIds } = req.body;
      
      if (!Array.isArray(criancaIds) || criancaIds.length === 0) {
        return errorResponse(res, 400, 'Dados inválidos', 'Lista de IDs das crianças é obrigatória');
      }

      const result = await turmaService.addCriancas(parseInt(id), criancaIds);
      
      return successResponse(res, 200, result.message, { count: result.count });
    } catch (error) {
      console.error('Erro ao adicionar crianças à turma:', error);
      
      if (error.message === 'Turma não encontrada' || 
          error.message === 'Uma ou mais crianças não foram encontradas') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao adicionar crianças à turma');
    }
  }

  /**
   * Remove crianças da turma
   */
  async removeCriancas(req, res) {
    try {
      const { id } = req.params;
      const { criancaIds } = req.body;
      
      if (!Array.isArray(criancaIds) || criancaIds.length === 0) {
        return errorResponse(res, 400, 'Dados inválidos', 'Lista de IDs das crianças é obrigatória');
      }

      const result = await turmaService.removeCriancas(parseInt(id), criancaIds);
      
      return successResponse(res, 200, result.message, { count: result.count });
    } catch (error) {
      console.error('Erro ao remover crianças da turma:', error);
      
      if (error.message === 'Turma não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao remover crianças da turma');
    }
  }

  /**
   * Busca crianças da turma
   */
  async getCriancas(req, res) {
    try {
      const { id } = req.params;
      const criancaService = require('../services/criancaService');
      
      const criancas = await criancaService.findByTurma(parseInt(id));
      
      return successResponse(res, 200, 'Crianças da turma encontradas com sucesso', criancas);
    } catch (error) {
      console.error('Erro ao buscar crianças da turma:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar crianças da turma');
    }
  }

  /**
   * Busca estatísticas das turmas
   */
  async getStatistics(req, res) {
    try {
      const statistics = await turmaService.getStatistics();
      
      return successResponse(res, 200, 'Estatísticas obtidas com sucesso', statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar estatísticas');
    }
  }

  /**
   * Busca turmas vazias (sem crianças)
   */
  async getTurmasVazias(req, res) {
    try {
      const { page, limit } = req.query;
      
      const result = await turmaService.findWithPagination({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        include: {
          criancas: true
        }
      });
      
      // Filtra apenas turmas vazias
      const turmasVazias = {
        ...result,
        data: result.data.filter(turma => turma.criancas.length === 0)
      };
      
      return successResponse(res, 200, 'Turmas vazias encontradas com sucesso', turmasVazias);
    } catch (error) {
      console.error('Erro ao buscar turmas vazias:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar turmas vazias');
    }
  }
}

module.exports = new TurmaController();

