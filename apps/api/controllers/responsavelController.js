const responsavelService = require('../services/responsavelService');
const { successResponse, errorResponse } = require('../utils/helpers');

class ResponsavelController {
  /**
   * Lista todos os responsáveis
   */
  async index(req, res) {
    try {
      const { page, limit, search } = req.query;
      
      if (page || limit || search) {
        const result = await responsavelService.findWithPagination({
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          search: search || ''
        });
        
        return successResponse(res, 200, 'Responsáveis encontrados com sucesso', result);
      }

      const responsaveis = await responsavelService.findAll();
      return successResponse(res, 200, 'Responsáveis encontrados com sucesso', responsaveis);
    } catch (error) {
      console.error('Erro ao buscar responsáveis:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar responsáveis');
    }
  }

  /**
   * Busca responsável por ID
   */
  async show(req, res) {
    try {
      const { id } = req.params;
      const responsavel = await responsavelService.findById(id);

      if (!responsavel) {
        return errorResponse(res, 404, 'Não encontrado', 'Responsável não encontrado');
      }

      return successResponse(res, 200, 'Responsável encontrado com sucesso', responsavel);
    } catch (error) {
      console.error('Erro ao buscar responsável:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar responsável');
    }
  }

  /**
   * Cria novo responsável
   */
  async store(req, res) {
    try {
      const responsavel = await responsavelService.create(req.body);
      return successResponse(res, 201, 'Responsável criado com sucesso', responsavel);
    } catch (error) {
      console.error('Erro ao criar responsável:', error);
      
      if (error.message === 'Email já está em uso') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao criar responsável');
    }
  }

  /**
   * Atualiza responsável
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const responsavel = await responsavelService.update(id, req.body);
      
      return successResponse(res, 200, 'Responsável atualizado com sucesso', responsavel);
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      
      if (error.message === 'Responsável não encontrado') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Email já está em uso') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao atualizar responsável');
    }
  }

  /**
   * Remove responsável
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await responsavelService.delete(id);
      
      return successResponse(res, 200, 'Responsável removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover responsável:', error);
      
      if (error.message === 'Responsável não encontrado') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Não é possível remover responsável que possui crianças vinculadas') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao remover responsável');
    }
  }

  /**
   * Autentica responsável
   */
  async authenticate(req, res) {
    try {
      const { email, senha } = req.body;
      
      if (!email || !senha) {
        return errorResponse(res, 400, 'Dados inválidos', 'Email e senha são obrigatórios');
      }

      const responsavel = await responsavelService.authenticate(email, senha);

      if (!responsavel) {
        return errorResponse(res, 401, 'Não autorizado', 'Email ou senha incorretos');
      }

      return successResponse(res, 200, 'Autenticação realizada com sucesso', responsavel);
    } catch (error) {
      console.error('Erro ao autenticar responsável:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao autenticar responsável');
    }
  }

  /**
   * Busca crianças do responsável
   */
  async getCriancas(req, res) {
    try {
      const { id } = req.params;
      const criancaService = require('../services/criancaService');
      
      const criancas = await criancaService.findByResponsavel(id);
      
      return successResponse(res, 200, 'Crianças encontradas com sucesso', criancas);
    } catch (error) {
      console.error('Erro ao buscar crianças do responsável:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar crianças do responsável');
    }
  }

  /**
   * Busca estatísticas dos responsáveis
   */
  async getStatistics(req, res) {
    try {
      const totalResponsaveis = await responsavelService.count();
      const criancaService = require('../services/criancaService');
      const totalCriancas = await criancaService.count();
      
      const statistics = {
        totalResponsaveis,
        totalCriancas,
        mediaCriancasPorResponsavel: totalResponsaveis > 0 ? Math.round(totalCriancas / totalResponsaveis * 100) / 100 : 0
      };
      
      return successResponse(res, 200, 'Estatísticas obtidas com sucesso', statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar estatísticas');
    }
  }
}

module.exports = new ResponsavelController();

