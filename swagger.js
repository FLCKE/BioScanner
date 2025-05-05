const swaggerJsDoc = require('swagger-jsdoc');

// Configuration de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Mon API',
            version: '1.0.0',
            description: 'Documentation de l\'API',
        },
        servers: [
            {
                url: 'http://localhost:5000', // adapte à ton cas
            },
        ],
    },
    apis: ['./routes/*.js'], // <-- fichiers à scanner pour la doc Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs; // Exporter la documentation Swagger pour l'utiliser dans le serveur Express