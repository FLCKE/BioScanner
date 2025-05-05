const express = require('express');
const router = express.Router();
const auth = require('../middlewares/AuthMiddleware'); // Assurez-vous que le chemin est correct
const UserController = require('../controllers/UserController');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/user/add:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - passwordHash
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               passwordHash:
 *                 type: string
 *               localId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: L'utilisateur existe déjà ou erreur de validation
 */

router.post('/add', UserController.addUser); // Récupérer tous les utilisateurs

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token
 *       400:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Mot de passe incorrect
 */
router.get('/login', UserController.loginUser); // Récupérer un utilisateur

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */

router.get('/:id', auth.verifyToken, UserController.getUserById); // Récupérer un utilisateur par ID

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', auth.verifyToken, UserController.deleteUserById); // Supprimer un utilisateur par ID
/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               passwordHash:
 *                 type: string
 *               localId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', auth.verifyToken, UserController.UpdateUser); // Mettre à jour un utilisateur par ID
module.exports = router;