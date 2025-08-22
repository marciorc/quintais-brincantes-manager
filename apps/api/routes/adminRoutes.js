const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validate, validateId, adminSchemas } = require('../utils/validation');

/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: Gerenciamento de administradores
 */

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Lista todos os administradores
 *     tags: [Administradores]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca (nome ou email)
 *       - in: query
 *         name: simple
 *         schema:
 *           type: boolean
 *         description: Retorna formato simplificado (apenas id, nome e email)
 *     responses:
 *       200:
 *         description: Lista de administradores obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - type: array
 *                           items:
 *                             $ref: '#/components/schemas/Admin'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Admin'
 *                             pagination:
 *                               type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', adminController.index);

/**
 * @swagger
 * /api/admins/statistics:
 *   get:
 *     summary: Busca estatísticas dos administradores
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalAdmins:
 *                           type: integer
 *                         adminsRecentes:
 *                           type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/statistics', adminController.getStatistics);

/**
 * @swagger
 * /api/admins/dashboard:
 *   get:
 *     summary: Busca dados do dashboard administrativo
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Dashboard obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         administradores:
 *                           type: object
 *                         responsaveis:
 *                           type: object
 *                         criancas:
 *                           type: object
 *                         turmas:
 *                           type: object
 *                         resumo:
 *                           type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Busca administrador por ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador
 *     responses:
 *       200:
 *         description: Administrador encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Admin'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', validateId, adminController.show);

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Cria novo administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminInput'
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já está em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', validate(adminSchemas.create), adminController.store);

/**
 * @swagger
 * /api/admins/authenticate:
 *   post:
 *     summary: Autentica administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do administrador
 *               senha:
 *                 type: string
 *                 description: Senha do administrador
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Email ou senha incorretos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/authenticate', adminController.authenticate);

/**
 * @swagger
 * /api/admins/{id}/change-password:
 *   post:
 *     summary: Altera senha do administrador
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senhaAtual
 *               - novaSenha
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual do administrador
 *               novaSenha:
 *                 type: string
 *                 minLength: 6
 *                 description: Nova senha do administrador
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos ou senha atual incorreta
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id/change-password', validateId, adminController.changePassword);

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Atualiza administrador
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Administrador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Administrador não encontrado
 *       409:
 *         description: Email já está em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', validateId, validate(adminSchemas.update), adminController.update);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Remove administrador
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do administrador
 *     responses:
 *       200:
 *         description: Administrador removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Administrador não encontrado
 *       409:
 *         description: Não é possível remover o último administrador
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', validateId, adminController.destroy);

module.exports = router;

