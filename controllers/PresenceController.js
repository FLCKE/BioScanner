const Presence = require('../models/Presence');

async function addPresence(req, res) {
    // Ajout d'une nouvelle présence
    const { userId, localId, latitude, longitude } = req.body;
    const newPresence = await Presence.create({ userId, localId, latitude, longitude });
    newPresence.save()
        .then(presence => res.status(201).json(presence))
        .catch(err => res.status(400).json({ error: err.message }));
}
async function getAllPresences( res) {
    // Récupérer toutes les présences
    const presences = await Presence.find({});
    if (!presences) {
        return res.status(404).json({ message: 'Presences not found' });
    }
    res.status(200).json(presences);
}       

async function deletePresenceById(req, res) {
    // Supprimer une présence par ID
    const presenceId = req.params.id;
    const presence = await Presence.deleteOne({ _id: presenceId });
    if (!presence) {
        return res.status(404).json({ message: 'Presence not found' });
    }                   
    res.status(200).json(presence);
}
async function updatePresence(req, res) {
    // Mettre à jour une présence par ID
    const presenceId = req.params.id;
    const presence = await Presence.updateOne({ _id: presenceId }, req.body);
    if (!presence) {
        return res.status(404).json({ message: 'Presence not found' });
    }       
    res.status(200).json(presence);
}
async function getPresencesByUserId(req, res) {
    // Récupérer toutes les présences d'un utilisateur par ID
    const userId = req.params.id;
    const presences = await Presence.find({ userId: userId });
    if (!presences) {
        return res.status(404).json({ message: 'Presences not found' });
    }
    res.status(200).json(presences);
}
module.exports = {
    addPresence,
    getAllPresences,
    deletePresenceById,
    updatePresence,
    getPresencesByUserId,
};