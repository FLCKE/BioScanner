const Users = require('../models/Users');// Assurez-vous que le chemin est correct
const  handleRequest = require('../utils/handleRequest');// Assurez-vous que le chemin est correct
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Assurez-vous que bcrypt est installé


async function addUser(req, res) {
    try {
        let { name, email, password, localId } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await Users.create({ name, email, passwordHash, localId });
        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            localId: newUser.localId
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const userObj = newUser.toObject();
        delete userObj.passwordHash;
        res.status(201).json({ token, user: userObj });
    } catch (err) {
        console.error("Erreur dans addUser:", err);
        res.status(500).json({ error: err.message });
    }
}


async function loginUser(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    try {
        console.log("Tentative de login:", email, password);

        const user = await Users.findOne({ email });
        if (!user) {
            console.log("Utilisateur non trouvé");
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            console.log("Mot de passe incorrect");
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            name: user.name,
            localId: user.localId
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const userObj = user.toObject();
        delete userObj.passwordHash;

        return res.status(200).json({ token, user: userObj });
    } catch (err) {
        console.error("Erreur de login:", err);
        return res.status(500).json({ error: err.message });
    }
}


async function getUserById(req, res) {
    // Récupérer un utilisateur par ID
    const userId = req.params.id;
    const user = await Users.findOne({ _id: userId });
    handleRequest.verifyDataNotFound(user,res);
    
}

async function deleteUserById(req, res) {
    // Récupérer un utilisateur par ID
    const userId = req.params.id;
    const user = await Users.deleteOne({ _id: userId });
    handleRequest.verifyDataNotFound(user, res);
}
async function UpdateUser(req, res) {
    // Récupérer un utilisateur par ID
    const userId = req.params.id;
    const user = await Users.updateOne({ _id: userId }, req.body);
    handleRequest.verifyDataNotFound(user, res);
}
module.exports = {
    addUser,
    getUserById,
    deleteUserById,
    UpdateUser,
    loginUser
};