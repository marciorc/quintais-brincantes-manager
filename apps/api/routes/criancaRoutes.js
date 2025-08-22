const express = require('express');
const router = express.Router();
const criancaController = require('../controllers/criancaController');
const { validate, validateId, criancaSchemas } = require('../utils/validation');

/**
 * @swagger
 * tags:
 *   name: Crianças
 *   description: Gerenciamento de crianças
 */

/**
 * @swagger
 * /api/criancas:
 *   get:
 *     summary: Lista todas as crianças
 *     tags: [Crianças]
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
 *         description: Termo de busca (nome ou data de nascimento)
 *       - in: query
 *         name: responsavelId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do responsável
 *       - in: query
 *         name: turmaId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da turma
 *     responses:
 *       200:
 *         description: Lista de crianças obtida com sucesso
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
 *                             $ref: '#/components/schemas/Crianca'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Crianca'
 *                             pagination:
 *                               type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', criancaController.index);

/**
 * @swagger
 * /api/criancas/statistics:
 *   get:
 *     summary: Busca estatísticas das crianças
 *     tags: [Crianças]
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
 *                         totalCriancas:
 *                           type: integer
 *                         criancasComTurma:
 *                           type: integer
 *                         criancasSemTurma:
 *                           type: integer
 *                         turmasComCriancas:
 *                           type: integer
 *                         percentualComTurma:
 *                           type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/statistics', criancaController.getStatistics);

/**
 * @swagger
 * /api/criancas/sem-turma:
 *   get:
 *     summary: Lista crianças sem turma
 *     tags: [Crianças]
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
 *         description: Crianças sem turma encontradas com sucesso
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
 *                             $ref: '#/components/schemas/Crianca'
 *                         pagination:
 *                           type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/sem-turma', criancaController.getSemTurma);

/**
 * @swagger
 * /api/criancas/responsavel/{responsavelId}:
 *   get:
 *     summary: Busca crianças por responsável
 *     tags: [Crianças]
 *     parameters:
 *       - in: path
 *         name: responsavelId
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
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/responsavel/:responsavelId', criancaController.getByResponsavel);

/**
 * @swagger
 * /api/criancas/turma/{turmaId}:
 *   get:
 *     summary: Busca crianças por turma
 *     tags: [Crianças]
 *     parameters:
 *       - in: path
 *         name: turmaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
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
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/turma/:turmaId', criancaController.getByTurma);

/**
 * @swagger
 * /api/criancas/{id}:
 *   get:
 *     summary: Busca criança por ID
 *     tags: [Crianças]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da criança
 *     responses:
 *       200:
 *         description: Criança encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Crianca'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', validateId, criancaController.show);

/**
 * @swagger
 * /api/criancas:
 *   post:
 *     summary: Cria nova criança
 *     tags: [Crianças]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriancaInput'
 *     responses:
 *       201:
 *         description: Criança criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Crianca'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Responsável ou turma não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', validate(criancaSchemas.create), criancaController.store);

/**
 * @swagger
 * /api/criancas/update-turma-multiple:
 *   post:
 *     summary: Atualiza turma de múltiplas crianças
 *     tags: [Crianças]
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
 *                 description: IDs das crianças
 *               turmaId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID da nova turma (null para remover da turma)
 *     responses:
 *       200:
 *         description: Turma das crianças atualizada com sucesso
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
router.post('/update-turma-multiple', criancaController.updateTurmaMultiple);

/**
 * @swagger
 * /api/criancas/{id}:
 *   put:
 *     summary: Atualiza criança
 *     tags: [Crianças]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da criança
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
 *               dataNascimento:
 *                 type: string
 *               turmaId:
 *                 type: integer
 *                 nullable: true
 *               responsavelId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Criança atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Crianca'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Criança, responsável ou turma não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', validateId, validate(criancaSchemas.update), criancaController.update);

/**
 * @swagger
 * /api/criancas/{id}:
 *   delete:
 *     summary: Remove criança
 *     tags: [Crianças]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da criança
 *     responses:
 *       200:
 *         description: Criança removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', validateId, criancaController.destroy);

module.exports = router;

