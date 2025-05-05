const express = require('express');
const router = express.Router();
const PresenceController = require('../controllers/PresenceController');
/**
 * @swagger
 * tags:
 *   name: Presence
 *   description: Gestion des présences des utilisateurs
 */

/**
 * @swagger
 * /api/presence/add:
 *   post:
 *     summary: Ajouter une nouvelle présence
 *     tags: [Presence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - localId
 *               - latitude
 *               - longitude
 *             properties:
 *               userId:
 *                 type: string
 *               localId:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Présence ajoutée avec succès
 *       400:
 *         description: Erreur lors de l’ajout de la présence
 */

router.post('/add', PresenceController.addPresence); // Récupérer tous les utilisateurs

/**
 * @swagger
 * /api/presence/get-all-presences:
 *   get:
 *     summary: Obtenir toutes les présences
 *     tags: [Presence]
 *     responses:
 *       200:
 *         description: Liste des présences
 *       404:
 *         description: Aucune présence trouvée
 */
router.get('/get-all-presences', PresenceController.getAllPresences); // Récupérer un utilisateur par ID

/**
 * @swagger
 * /api/presence/{id}:
 *   get:
 *     summary: Obtenir toutes les présences d’un utilisateur par son ID
 *     tags: [Presence]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l’utilisateur
 *     responses:
 *       200:
 *         description: Liste des présences de l’utilisateur
 *       404:
 *         description: Aucune présence trouvée
 */
router.get('/:id', PresenceController.getPresencesByUserId); // Supprimer un utilisateur par ID


/**
 * @swagger
 * /presences/{id}:
 *   delete:
 *     summary: Supprimer une présence par son ID
 *     tags: [Presence]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la présence
 *     responses:
 *       200:
 *         description: Présence supprimée
 *       404:
 *         description: Présence non trouvée
 */
router.delete('/:id', PresenceController.deletePresenceById); // Mettre à jour un utilisateur par ID

/**
 * @swagger
 * /api/presence/{id}:
 *   put:
 *     summary: Mettre à jour une présence
 *     tags: [Presence]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la présence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               localId:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Présence mise à jour
 *       404:
 *         description: Présence non trouvée
 */
router.put('/:id', PresenceController.updatePresence); // Mettre à jour un utilisateur par ID
module.exports = router;