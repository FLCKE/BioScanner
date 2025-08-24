const app = require('./app'); // Assurez-vous que le chemin est correct

const db = require('./config/db'); // Assurez-vous que le chemin est correct
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.get('/api/ping', (req, res) => res.json({ pong: true }));


db(); // Connexion à la base de données MongoDB

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

