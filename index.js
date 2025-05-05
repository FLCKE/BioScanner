const app = require('./app'); // Assurez-vous que le chemin est correct

const db = require('./config/db'); // Assurez-vous que le chemin est correct
require('dotenv').config();

const PORT = process.env.PORT || 5000;



db(); // Connexion à la base de données MongoDB


app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
