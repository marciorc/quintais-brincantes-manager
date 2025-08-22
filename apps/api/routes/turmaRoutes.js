const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');
const { validate, validateId, turmaSchemas } = require('../utils/validation');

/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: Gerenciamento de turmas
 */

/**
 * @swagger
 * /api/turmas:
 *   get:
 *     summary: Lista todas as turmas
 *     tags: [Turmas]
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
 *         description: Termo de busca (nome da turma)
 *       - in: query
 *         name: simple
 *         schema:
 *           type: boolean
 *         description: Retorna formato simplificado (apenas id, nome e contagem)
 *     responses:
 *       200:
 *         description: Lista de turmas obtida com sucesso
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
 *                             $ref: '#/components/schemas/Turma'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Turma'
 *                             pagination:
 *                               type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', turmaController.index);

/**
 * @swagger
 * /api/turmas/statistics:
 *   get:
 *     summary: Busca estatísticas das turmas
 *     tags: [Turmas]
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
 *                         totalTurmas:
 *                           type: integer
 *                         turmasComCriancas:
 *                           type: integer
 *                         turmasVazias:
 *                           type: integer
 *                         mediaCriancasPorTurma:
 *                           type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/statistics', turmaController.getStatistics);

/**
 * @swagger
 * /api/turmas/vazias:
 *   get:
 *     summary: Lista turmas vazias (sem crianças)
 *     tags: [Turmas]
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
 *     responses:
 *       200:
 *         description: Turmas vazias encontradas com sucesso
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
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Turma'
 *                         pagination:
 *                           type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/vazias', turmaController.getTurmasVazias);

/**
 * @swagger
 * /api/turmas/{id}:
 *   get:
 *     summary: Busca turma por ID
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Turma'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', validateId, turmaController.show);

/**
 * @swagger
 * /api/turmas/{id}/criancas:
 *   get:
 *     summary: Busca crianças da turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Crianças da turma encontradas com sucesso
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
router.get('/:id/criancas', validateId, turmaController.getCriancas);

/**
 * @swagger
 * /api/turmas:
 *   post:
 *     summary: Cria nova turma
 *     tags: [Turmas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurmaInput'
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Turma'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Nome da turma já está em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', validate(turmaSchemas.create), turmaController.store);

/**
 * @swagger
 * /api/turmas/{id}/add-criancas:
 *   post:
 *     summary: Adiciona crianças à turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - criancaIds
 *             properties:
 *               criancaIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs das crianças a serem adicionadas
 *     responses:
 *       200:
 *         description: Crianças adicionadas à turma com sucesso
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
 *                         count:
 *                           type: integer
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Turma ou crianças não encontradas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id/add-criancas', validateId, turmaController.addCriancas);

/**
 * @swagger
 * /api/turmas/{id}/remove-criancas:
 *   post:
 *     summary: Remove crianças da turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - criancaIds
 *             properties:
 *               criancaIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs das crianças a serem removidas
 *     responses:
 *       200:
 *         description: Crianças removidas da turma com sucesso
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
 *                         count:
 *                           type: integer
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id/remove-criancas', validateId, turmaController.removeCriancas);

/**
 * @swagger
 * /api/turmas/{id}:
 *   put:
 *     summary: Atualiza turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
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
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Turma'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Turma não encontrada
 *       409:
 *         description: Nome da turma já está em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', validateId, validate(turmaSchemas.update), turmaController.update);

/**
 * @swagger
 * /api/turmas/{id}:
 *   delete:
 *     summary: Remove turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         description: Se true, remove a turma e desvincula as crianças
 *     responses:
 *       200:
 *         description: Turma removida com sucesso
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
 *                         turma:
 *                           $ref: '#/components/schemas/Turma'
 *                         criancasDesvinculadas:
 *                           type: integer
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Turma não encontrada
 *       409:
 *         description: Turma possui crianças vinculadas
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', validateId, turmaController.destroy);

module.exports = router;

