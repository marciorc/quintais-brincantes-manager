const { prisma } = require('../config/database');
const { hashPassword, comparePassword, sanitizeObject, sanitizeArray } = require('../utils/helpers');

class AdminService {
  /**
   * Busca todos os administradores
   * @param {object} options - Opções de busca (skip, take, etc.)
   * @returns {Promise<Array>} Lista de administradores
   */
  async findAll(options = {}) {
    const {
      skip = 0,
      take = 50,
      orderBy = { criadoEm: 'desc' }
    } = options;

    const admins = await prisma.admin.findMany({
      skip,
      take,
      orderBy
    });

    return sanitizeArray(admins);
  }

  /**
   * Busca administrador por ID
   * @param {number} id - ID do administrador
   * @returns {Promise<object|null>} Administrador encontrado ou null
   */
  async findById(id) {
    const admin = await prisma.admin.findUnique({
      where: { id }
    });

    return admin ? sanitizeObject(admin) : null;
  }

  /**
   * Busca administrador por usuario
   * @param {string} usuario - usuario do administrador
   * @returns {Promise<object|null>} Administrador encontrado ou null
   */
  async findByUser(usuario) {
    const admin = await prisma.admin.findUnique({
      where: { usuario }
    });

    return admin ? sanitizeObject(admin) : null;
  }

  /**
   * Cria novo administrador
   * @param {object} data - Dados do administrador
   * @returns {Promise<object>} Administrador criado
   */
  async create(data) {
    const { senha, ...adminData } = data;

    // Verifica se usuario já existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { usuario: adminData.usuario }
    });

    if (existingAdmin) {
      throw new Error('Usuário já está em uso');
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha);

    const admin = await prisma.admin.create({
      data: {
        ...adminData,
        senhaHash
      }
    });

    return sanitizeObject(admin);
  }

  /**
   * Atualiza administrador
   * @param {number} id - ID do administrador
   * @param {object} data - Dados para atualização
   * @returns {Promise<object>} Administrador atualizado
   */
  async update(id, data) {
    // Verifica se administrador existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      throw new Error('Administrador não encontrado');
    }

    const updateData = { ...data };

    // Se está atualizando usuario, verifica se não está em uso
    if (data.usuario && data.usuario !== existingAdmin.usuario) {
      const userInUse = await prisma.admin.findUnique({
        where: { usuario: data.usuario }
      });

      if (userInUse) {
        throw new Error('Usuário já está em uso');
      }
    }

    // Se está atualizando senha, gera novo hash
    if (data.senha) {
      updateData.senhaHash = await hashPassword(data.senha);
      delete updateData.senha;
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData
    });

    return sanitizeObject(admin);
  }

  /**
   * Remove administrador
   * @param {number} id - ID do administrador
   * @returns {Promise<object>} Administrador removido
   */
  async delete(id) {
    // Verifica se administrador existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      throw new Error('Administrador não encontrado');
    }

    // Verifica se não é o último administrador
    const totalAdmins = await prisma.admin.count();
    
    if (totalAdmins <= 1) {
      throw new Error('Não é possível remover o último administrador do sistema');
    }

    const admin = await prisma.admin.delete({
      where: { id }
    });

    return sanitizeObject(admin);
  }

  /**
   * Autentica administrador
   * @param {string} usuario - Usuário do administrador
   * @param {string} senha - Senha do administrador
   * @returns {Promise<object|null>} Administrador autenticado ou null
   */
  async authenticate(usuario, senha) {
    const admin = await prisma.admin.findUnique({
      where: { usuario }
    });

    if (!admin) {
      return null;
    }

    const senhaValida = await comparePassword(senha, admin.senhaHash);

    if (!senhaValida) {
      return null;
    }

    return sanitizeObject(admin);
  }

  /**
   * Conta total de administradores
   * @param {object} where - Condições de filtro
   * @returns {Promise<number>} Total de administradores
   */
  async count(where = {}) {
    return await prisma.admin.count({ where });
  }

  /**
   * Busca administradores com paginação
   * @param {object} params - Parâmetros de paginação e filtro
   * @returns {Promise<object>} Resultado paginado
   */
  async findWithPagination(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = ''
    } = params;

    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { usuario: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [admins, total] = await Promise.all([
      prisma.admin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { criadoEm: 'desc' }
      }),
      prisma.admin.count({ where })
    ]);

    return {
      data: sanitizeArray(admins),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Altera senha do administrador
   * @param {number} id - ID do administrador
   * @param {string} senhaAtual - Senha atual
   * @param {string} novaSenha - Nova senha
   * @returns {Promise<object>} Resultado da operação
   */
  async changePassword(id, senhaAtual, novaSenha) {
    // Busca administrador com senha
    const admin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!admin) {
      throw new Error('Administrador não encontrado');
    }

    // Verifica senha atual
    const senhaValida = await comparePassword(senhaAtual, admin.senhaHash);

    if (!senhaValida) {
      throw new Error('Senha atual incorreta');
    }

    // Gera hash da nova senha
    const novoHash = await hashPassword(novaSenha);

    // Atualiza senha
    await prisma.admin.update({
      where: { id },
      data: { senhaHash: novoHash }
    });

    return {
      success: true,
      message: 'Senha alterada com sucesso'
    };
  }

  /**
   * Busca estatísticas dos administradores
   * @returns {Promise<object>} Estatísticas
   */
  async getStatistics() {
    const [
      totalAdmins,
      adminsRecentes
    ] = await Promise.all([
      prisma.admin.count(),
      prisma.admin.count({
        where: {
          criadoEm: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
          }
        }
      })
    ]);

    return {
      totalAdmins,
      adminsRecentes
    };
  }

  /**
   * Busca administradores simples (apenas id, nome e usuario)
   * @returns {Promise<Array>} Lista simplificada de administradores
   */
  async findSimple() {
    return await prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        usuario: true,
        criadoEm: true
      },
      orderBy: { nome: 'asc' }
    });
  }
}

module.exports = new AdminService();

