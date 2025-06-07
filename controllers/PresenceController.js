const Presence = require('../models/Presence');
const User = require('../models/Users');
const Local = require('../models/Local');

// Fonction utilitaire pour calculer la distance en mètres
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Rayon de la Terre en mètres

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Ajouter une présence
async function addPresence(req, res) {
  console.log("🧪 Contenu de req.body :", req.body); // <-- Ajoute ceci
  const { userId, latitude, longitude } = req.body;

  console.log('➡️ Requête reçue pour ajouter une présence');
  console.log('Données reçues :', { userId, latitude, longitude });

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn('❌ Utilisateur introuvable avec ID :', userId);
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    console.log('✅ Utilisateur trouvé :', user);

    const local = await Local.findById(user.localId);
    if (!local) {
      console.warn('❌ Local introuvable pour le localId :', user.localId);
      return res.status(404).json({ message: 'Local introuvable pour cet utilisateur' });
    }

    console.log('✅ Local trouvé :', local);

    const distance = getDistanceInMeters(latitude, longitude, local.latitude, local.longitude);
    const isInside = distance <= local.rayon;

    console.log(`📍 Distance calculée : ${distance} m`);
    console.log(`📍 Est dans le périmètre ? ${isInside}`);

    const presence = new Presence({
      userId,
      localId: local._id,
      latitude,
      longitude
    });

    await presence.save();
    console.log('✅ Présence enregistrée avec succès :', presence);

    return res.status(201).json({
      message: isInside ? 'Présence enregistrée dans le local' : 'En dehors du périmètre',
      presence
    });
  } catch (error) {
    console.error('❌ Erreur serveur lors de l’ajout de présence :', error);
    return res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

// Récupérer toutes les présences
async function getAllPresences(req, res) {
  try {
    const presences = await Presence.find({});
    return res.status(200).json(presences);
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Supprimer une présence par ID
async function deletePresenceById(req, res) {
  try {
    const presenceId = req.params.id;
    const result = await Presence.deleteOne({ _id: presenceId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Présence introuvable' });
    }

    res.status(200).json({ message: 'Présence supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la présence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Mettre à jour une présence
async function updatePresence(req, res) {
  try {
    const presenceId = req.params.id;
    const result = await Presence.updateOne({ _id: presenceId }, req.body);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Aucune mise à jour effectuée ou présence non trouvée' });
    }

    res.status(200).json({ message: 'Présence mise à jour' });
  } catch (error) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Récupérer les présences d'un utilisateur
async function getPresencesByUserId(req, res) {
  try {
    const userId = req.params.id;
    const presences = await Presence.find({ userId });

    return res.status(200).json(presences); // ✅ Toujours 200 même si vide
  } catch (error) {
    console.error('Erreur récupération par userId:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}


module.exports = {
  addPresence,
  getAllPresences,
  deletePresenceById,
  updatePresence,
  getPresencesByUserId
};
