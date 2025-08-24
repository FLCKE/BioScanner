// api/index.js
require('dotenv').config();
const serverless = require('serverless-http');
const app = require('../app'); // app.js à la racine

module.exports = serverless(app); // surtout PAS de app.listen ici
