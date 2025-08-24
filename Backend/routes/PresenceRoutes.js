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
 *               - latitude
 *               - longitude
 *             properties:
 *               userId:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Présence ajoutée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/add', PresenceController.addPresence);

/**
 * @swagger
 * /api/presence/get-all-presences:
 *   get:
 *     summary: Récupérer toutes les présences
 *     tags: [Presence]
 *     responses:
 *       200:
 *         description: Liste des présences
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/get-all-presences', PresenceController.getAllPresences);

/**
 * @swagger
 * /api/presence/{id}:
 *   get:
 *     summary: Récupérer les présences d’un utilisateur par son ID
 *     tags: [Presence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur
 *     responses:
 *       200:
 *         description: Liste des présences de l’utilisateur
 *       404:
 *         description: Aucune présence trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/user/:id', PresenceController.getPresencesByUserId);

/**
 * @swagger
 * /api/presence/{id}:
 *   delete:
 *     summary: Supprimer une présence par son ID
 *     tags: [Presence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la présence
 *     responses:
 *       200:
 *         description: Présence supprimée
 *       404:
 *         description: Présence non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/delete/:id', PresenceController.deletePresenceById);

/**
 * @swagger
 * /api/presence/{id}:
 *   put:
 *     summary: Mettre à jour une présence
 *     tags: [Presence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la présence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Présence mise à jour
 *       404:
 *         description: Présence non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/update/:id', PresenceController.updatePresence);



module.exports = router;
