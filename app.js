const express = require("express");
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.js'); // Assurez-vous que le chemin est correct

const userRoutes = require("./routes/UserRoutes"); // Assurez-vous que le chemin est correct
const localRoutes = require("./routes/LocalRoutes"); // Assurez-vous que le chemin est correct
const presenceRoutes = require("./routes/PresenceRoutes"); // Assurez-vous que le chemin est correct        
const pictureRoutes = require("./routes/PictureRoutes");

const app = express();
app.use(express.json()); // Middleware pour parser le JSON dans les requêtes

app.use(cors({ origin: "http://localhost:5000", credentials: true })); // Middleware pour activer CORS


app.get("/", (req, res) => {
    res.send("API OK ✅");
});
app.use("/api/picture", pictureRoutes);
app.use("/api/user", userRoutes); // Assurez-vous que le chemin est correct
app.use("/api/local", localRoutes); // Assurez-vous que le chemin est correct
app.use("/api/presence", presenceRoutes); // Assurez-vous que le chemin est correct
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app; // Exporter l'application Express pour les tests