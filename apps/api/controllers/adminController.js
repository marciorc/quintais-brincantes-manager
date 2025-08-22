const adminService = require('../services/adminService');
const { successResponse, errorResponse } = require('../utils/helpers');

class AdminController {
  /**
   * Lista todos os administradores
   */
  async index(req, res) {
    try {
      const { page, limit, search, simple } = req.query;
      
      // Se solicitado formato simples
      if (simple === 'true') {
        const admins = await adminService.findSimple();
        return successResponse(res, 200, 'Administradores encontrados com sucesso', admins);
      }
      
      if (page || limit || search) {
        const result = await adminService.findWithPagination({
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          search: search || ''
        });
        
        return successResponse(res, 200, 'Administradores encontrados com sucesso', result);
      }

      const admins = await adminService.findAll();
      return successResponse(res, 200, 'Administradores encontrados com sucesso', admins);
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar administradores');
    }
  }

  /**
   * Busca administrador por ID
   */
  async show(req, res) {
    try {
      const { id } = req.params;
      const admin = await adminService.findById(id);

      if (!admin) {
        return errorResponse(res, 404, 'Não encontrado', 'Administrador não encontrado');
      }

      return successResponse(res, 200, 'Administrador encontrado com sucesso', admin);
    } catch (error) {
      console.error('Erro ao buscar administrador:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar administrador');
    }
  }

  /**
   * Cria novo administrador
   */
  async store(req, res) {
    try {
      const admin = await adminService.create(req.body);
      return successResponse(res, 201, 'Administrador criado com sucesso', admin);
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      
      if (error.message === 'Usuário já está em uso') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao criar administrador');
    }
  }

  /**
   * Atualiza administrador
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const admin = await adminService.update(id, req.body);
      
      return successResponse(res, 200, 'Administrador atualizado com sucesso', admin);
    } catch (error) {
      console.error('Erro ao atualizar administrador:', error);
      
      if (error.message === 'Administrador não encontrado') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Usuário já está em uso') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao atualizar administrador');
    }
  }

  /**
   * Remove administrador
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await adminService.delete(id);
      
      return successResponse(res, 200, 'Administrador removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover administrador:', error);
      
      if (error.message === 'Administrador não encontrado') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Não é possível remover o último administrador do sistema') {
        return errorResponse(res, 409, 'Conflito', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao remover administrador');
    }
  }

  /**
   * Autentica administrador
   */
  async authenticate(req, res) {
    try {
      const { usuario, senha } = req.body;
      
      if (!usuario || !senha) {
        return errorResponse(res, 400, 'Dados inválidos', 'Usuário e senha são obrigatórios');
      }

      const admin = await adminService.authenticate(usuario, senha);

      if (!admin) {
        return errorResponse(res, 401, 'Não autorizado', 'Usuário ou senha incorretos');
      }

      return successResponse(res, 200, 'Autenticação realizada com sucesso', admin);
    } catch (error) {
      console.error('Erro ao autenticar administrador:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao autenticar administrador');
    }
  }

  /**
   * Altera senha do administrador
   */
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;
      
      if (!senhaAtual || !novaSenha) {
        return errorResponse(res, 400, 'Dados inválidos', 'Senha atual e nova senha são obrigatórias');
      }

      const result = await adminService.changePassword(id, senhaAtual, novaSenha);
      
      return successResponse(res, 200, result.message);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      
      if (error.message === 'Administrador não encontrado') {
        return errorResponse(res, 404, 'Não encontrado', error.message);
      }
      
      if (error.message === 'Senha atual incorreta') {
        return errorResponse(res, 400, 'Dados inválidos', error.message);
      }
      
      return errorResponse(res, 500, 'Erro interno', 'Erro ao alterar senha');
    }
  }

  /**
   * Busca estatísticas dos administradores
   */
  async getStatistics(req, res) {
    try {
      const statistics = await adminService.getStatistics();
      
      return successResponse(res, 200, 'Estatísticas obtidas com sucesso', statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar estatísticas');
    }
  }

  /**
   * Busca dashboard com estatísticas gerais
   */
  async getDashboard(req, res) {
    try {
      const responsavelService = require('../services/responsavelService');
      const criancaService = require('../services/criancaService');
      const turmaService = require('../services/turmaService');
      
      const [
        adminStats,
        totalResponsaveis,
        criancaStats,
        turmaStats
      ] = await Promise.all([
        adminService.getStatistics(),
        responsavelService.count(),
        criancaService.getStatistics(),
        turmaService.getStatistics()
      ]);

      const dashboard = {
        administradores: adminStats,
        responsaveis: {
          total: totalResponsaveis
        },
        criancas: criancaStats,
        turmas: turmaStats,
        resumo: {
          totalUsuarios: adminStats.totalAdmins + totalResponsaveis,
          totalCriancas: criancaStats.totalCriancas,
          totalTurmas: turmaStats.totalTurmas,
          ocupacaoTurmas: turmaStats.totalTurmas > 0 ? 
            Math.round((turmaStats.turmasComCriancas / turmaStats.totalTurmas) * 100) : 0
        }
      };
      
      return successResponse(res, 200, 'Dashboard obtido com sucesso', dashboard);
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      return errorResponse(res, 500, 'Erro interno', 'Erro ao buscar dashboard');
    }
  }
}

module.exports = new AdminController();

