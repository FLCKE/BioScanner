const express = require('express');
const router =express.Router();
const LocalController = require('../controllers/LocalController');
/**
 * @swagger
 * tags:
 *   name: Local
 *   description: Gestion des lieux (locaux) où les utilisateurs peuvent être présents
 */

/**
 * @swagger
 * /api/local/add:
 *   post:
 *     summary: Ajouter un nouveau local
 *     tags: [Local]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - latitude
 *               - longitude
 *               - adresse
 *               - rayon
 *             properties:
 *               nom:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               adresse:
 *                 type: string
 *               rayon:
 *                 type: number
 *     responses:
 *       201:
 *         description: Local ajouté avec succès
 *       400:
 *         description: Erreur lors de l’ajout du local
 */

router.post('/add',LocalController.addLocal); // Récupérer tous les utilisateurs

/**
 * @swagger
 * /api/local/get-all-locals:
 *   get:
 *     summary: Récupérer tous les locaux
 *     tags: [Local]
 *     responses:
 *       200:
 *         description: Liste de tous les locaux
 *       404:
 *         description: Aucun local trouvé
 */
router.get('/get-all-locals',LocalController.getAllLocals); // Récupérer un utilisateur par ID

/**
 * @swagger
 * /api/local/{id}:
 *   get:
 *     summary: Récupérer un local par ID
 *     tags: [Local]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du local
 *     responses:
 *       200:
 *         description: Local trouvé
 *       404:
 *         description: Local non trouvé
 */
router.get('/:id',LocalController.getLocalById); // Supprimer un utilisateur par ID

/**
 * @swagger
 * /api/local/{id}:
 *   delete:
 *     summary: Supprimer un local par ID
 *     tags: [Local]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du local à supprimer
 *     responses:
 *       200:
 *         description: Local supprimé
 *       404:
 *         description: Local non trouvé
 */
router.delete('/:id',LocalController.deleteLocalById); // Mettre à jour un utilisateur par ID

/**
 * @swagger
 * /api/local/{id}:
 *   put:
 *     summary: Mettre à jour un local par ID
 *     tags: [Local]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du local à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               adresse:
 *                 type: string
 *               rayon:
 *                 type: number
 *     responses:
 *       200:
 *         description: Local mis à jour
 *       404:
 *         description: Local non trouvé
 */
router.put('/:id',LocalController.UpdateLocal); // Mettre à jour un utilisateur par ID
module.exports = router;