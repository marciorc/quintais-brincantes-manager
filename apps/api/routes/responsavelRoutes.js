const express = require('express');
const router = express.Router();
const responsavelController = require('../controllers/responsavelController');
const { validate, validateId, responsavelSchemas } = require('../utils/validation');

/**
 * @swagger
 * tags:
 *   name: Responsáveis
 *   description: Gerenciamento de responsáveis
 */

/**
 * @swagger
 * /api/responsaveis:
 *   get:
 *     summary: Lista todos os responsáveis
 *     tags: [Responsáveis]
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
 *     responses:
 *       200:
 *         description: Lista de responsáveis obtida com sucesso
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
 *                             $ref: '#/components/schemas/Responsavel'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Responsavel'
 *                             pagination:
 *                               type: object
 *                               properties:
 *                                 page:
 *                                   type: integer
 *                                 limit:
 *                                   type: integer
 *                                 total:
 *                                   type: integer
 *                                 pages:
 *                                   type: integer
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', responsavelController.index);

/**
 * @swagger
 * /api/responsaveis/statistics:
 *   get:
 *     summary: Busca estatísticas dos responsáveis
 *     tags: [Responsáveis]
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
 *                         totalResponsaveis:
 *                           type: integer
 *                         totalCriancas:
 *                           type: integer
 *                         mediaCriancasPorResponsavel:
 *                           type: number
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/statistics', responsavelController.getStatistics);

/**
 * @swagger
 * /api/responsaveis/{id}:
 *   get:
 *     summary: Busca responsável por ID
 *     tags: [Responsáveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável
 *     responses:
 *       200:
 *         description: Responsável encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Responsavel'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Responsável não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', validateId, responsavelController.show);

/**
 * @swagger
 * /api/responsaveis/{id}/criancas:
 *   get:
 *     summary: Busca crianças do responsável
 *     tags: [Responsáveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável
 *     responses:
 *       200:
 *         description: Crianças encontradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Crianca'
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id/criancas', validateId, responsavelController.getCriancas);

/**
 * @swagger
 * /api/responsaveis:
 *   post:
 *     summary: Cria novo responsável
 *     tags: [Responsáveis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponsavelInput'
 *     responses:
 *       201:
 *         description: Responsável criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Responsavel'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já está em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', validate(responsavelSchemas.create), responsavelController.store);

/**
 * @swagger
 * /api/responsaveis/authenticate:
 *   post:
 *     summary: Autentica responsável
 *     tags: [Responsáveis]
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
 *                 description: Email do responsável
 *               senha:
 *                 type: string
 *                 description: Senha do responsável
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
 *                       $ref: '#/components/schemas/Responsavel'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Email ou senha incorretos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/authenticate', responsavelController.authenticate);

/**
 * @swagger
 * /api/responsaveis/{id}:
 *   put:
 *     summary: Atualiza responsável
 *     tags: [Responsáveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável
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
 *               contato:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 20
 *               senha:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Responsável atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Responsavel'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Responsável não encontrado
 *       409:
 *         description: Email já está em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', validateId, validate(responsavelSchemas.update), responsavelController.update);

/**
 * @swagger
 * /api/responsaveis/{id}:
 *   delete:
 *     summary: Remove responsável
 *     tags: [Responsáveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável
 *     responses:
 *       200:
 *         description: Responsável removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Responsável não encontrado
 *       409:
 *         description: Responsável possui crianças vinculadas
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', validateId, responsavelController.destroy);

module.exports = router;

