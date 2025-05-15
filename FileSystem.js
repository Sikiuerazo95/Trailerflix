const fs = require('fs').promises; // Utilizamos fs.promises para trabajar con promesas
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables definidas en el archivo .ENV

const database = path.join(__dirname, process.env.DATA_PATH); // Construcción de la ruta al archivo

// Función asincronica que lee y parsea el archivo JSON
async function TRAILERFLIX() {
  try {
    const data = await fs.readFile(database, 'utf8'); // Lee el archivo
    return JSON.parse(data); // Parseamos el JSON y lo devolvemos
  } catch (error) {
    console.error("Error al parsear JSON:", error);// Si ocurre un error al parsear el JSON
    throw error;
  }
}

// Exportacion de la funcion
module.exports = TRAILERFLIX;
