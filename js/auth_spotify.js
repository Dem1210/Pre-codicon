// acceder a claves de entorno .env
require("dotenv").config();

// Credenciales de la aplicacion
client_id = process.env.CLIENT_ID;
client_secret = process.env.CLIENT_SECRET;

console.log(client_id, client_secret);
