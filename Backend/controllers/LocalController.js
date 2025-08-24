const local =require('../models/Local');
async function addLocal(req, res) {
    // Ajout d'un nouvel utilisateur
    const { nom, latitude, longitude, adresse, rayon } = req.body;
    const newLocal = await local.create({ nom, latitude, longitude, adresse, rayon });
    newLocal.save()
        .then(local => res.status(201).json(local))
        .catch(err => res.status(400).json({ error: err.message }));
}
async function getAllLocals(req, res) {
    // Récupérer un utilisateur par ID
    const locals = await local.find({});
    if (!locals) {
        return res.status(404).json({ message: 'local not found' });
    }
    res.status(200).json(locals);
}
async function getLocalById(req, res) {
    // Récupérer un utilisateur par ID
    const localId = req.params.id;
    const local = await local.findOne({ _id: localId });
    if (!local) {
        return res.status(404).json({ message: 'Local not found' });
    }
    res.status(200).json(local);
}
async function deleteLocalById(req, res) {
    // Récupérer un utilisateur par ID
    const localId = req.params.id;
    const local = await local.deleteOne({ _id: localId });
    if (!local) {
        return res.status(404).json({ message: 'Local not found' });
    }                   
    res.status(200).json(local);
}
async function UpdateLocal(req, res) {
    // Récupérer un utilisateur par ID
    const localId = req.params.id;
    const local = await local.updateOne({ _id: localId }, req.body);
    if (!local) {
        return res.status(404).json({ message: 'Local not found' });
    }       
    res.status(200).json(local);
}
module.exports = {
    addLocal,
    getAllLocals,
    getLocalById,
    deleteLocalById,
    UpdateLocal,
};
// Compare this snippet from routes/LocalRoutes.js: