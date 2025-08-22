const criancaService = require('../services/criancaService');
const { successResponse, errorResponse } = require('../utils/helpers');

class CriancaController {
  /**
   * Lista todas as crianças
   */
  async index(req, res) {
    try {
      const { page, limit, search, responsavelId, turmaId } = req.query;
      
      if (page || limit || search || responsavelId || turmaId) {
        const result = await criancaService.findWithPagination({
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          search: search || '',
          responsavelId: responsavelId ? parseInt(responsavelId) : null,
          turmaId: turmaId ? parseInt(turmaId) : null
        });
        
        return successResponse(res, 200, 'Crianças encontradas com sucesso', result);
      }

      const criancas = await criancaService.findAll();
      return successResponse(res, 200, 'Crianças encontradas com sucesso', criancas);
    } catch (error) {
      console.error('Erro ao buscar crianças:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar crianças');
    }
  }

  /**
   * Busca criança por ID
   */
  async show(req, res) {
    try {
      const { id } = req.params;
      const crianca = await criancaService.findById(id);

      if (!crianca) {
        return errorResponse(res, 404, 'Não encontrado', 'Criança não encontrada');
      }

      return successResponse(res, 200, 'Criança encontrada com sucesso', crianca);
    } catch (error) {
      console.error('Erro ao buscar criança:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar criança');
    }
  }

  /**
   * Cria nova criança
   */
  async store(req, res) {
    try {
      const crianca = await criancaService.create(req.body);
      return successResponse(res, 201, 'Criança criada com sucesso', crianca);
    } catch (error) {
      console.error('Erro ao criar criança:', error);
      
      if (error.message === 'Responsável não encontrado' || error.message === 'Turma não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao criar criança');
    }
  }

  /**
   * Atualiza criança
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const crianca = await criancaService.update(id, req.body);
      
      return successResponse(res, 200, 'Criança atualizada com sucesso', crianca);
    } catch (error) {
      console.error('Erro ao atualizar criança:', error);
      
      if (error.message === 'Criança não encontrada' || 
          error.message === 'Responsável não encontrado' || 
          error.message === 'Turma não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao atualizar criança');
    }
  }

  /**
   * Remove criança
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await criancaService.delete(id);
      
      return successResponse(res, 200, 'Criança removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover criança:', error);
      
      if (error.message === 'Criança não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao remover criança');
    }
  }

  /**
   * Busca crianças por responsável
   */
  async getByResponsavel(req, res) {
    try {
      const { responsavelId } = req.params;
      const criancas = await criancaService.findByResponsavel(parseInt(responsavelId));
      
      return successResponse(res, 200, 'Crianças encontradas com sucesso', criancas);
    } catch (error) {
      console.error('Erro ao buscar crianças por responsável:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar crianças por responsável');
    }
  }

  /**
   * Busca crianças por turma
   */
  async getByTurma(req, res) {
    try {
      const { turmaId } = req.params;
      const criancas = await criancaService.findByTurma(parseInt(turmaId));
      
      return successResponse(res, 200, 'Crianças encontradas com sucesso', criancas);
    } catch (error) {
      console.error('Erro ao buscar crianças por turma:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar crianças por turma');
    }
  }

  /**
   * Atualiza turma de múltiplas crianças
   */
  async updateTurmaMultiple(req, res) {
    try {
      const { criancaIds, turmaId } = req.body;
      
      if (!Array.isArray(criancaIds) || criancaIds.length === 0) {
        return errorResponse(res, 400, 'Dados inválidos', 'Lista de IDs das crianças é obrigatória');
      }

      const result = await criancaService.updateTurmaMultiple(criancaIds, turmaId || null);
      
      return successResponse(res, 200, result.message, { count: result.count });
    } catch (error) {
      console.error('Erro ao atualizar turma das crianças:', error);
      
      if (error.message === 'Turma não encontrada') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao atualizar turma das crianças');
    }
  }

  /**
   * Busca estatísticas das crianças
   */
  async getStatistics(req, res) {
    try {
      const statistics = await criancaService.getStatistics();
      
      return successResponse(res, 200, 'Estatísticas obtidas com sucesso', statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar estatísticas');
    }
  }

  /**
   * Busca crianças sem turma
   */
  async getSemTurma(req, res) {
    try {
      const { page, limit } = req.query;
      
      const result = await criancaService.findWithPagination({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        turmaId: null
      });
      
      return successResponse(res, 200, 'Crianças sem turma encontradas com sucesso', result);
    } catch (error) {
      console.error('Erro ao buscar crianças sem turma:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar crianças sem turma');
    }
  }
}

module.exports = new CriancaController();

