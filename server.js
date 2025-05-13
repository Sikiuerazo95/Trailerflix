const express = require('express');
const TRAILERFLIX = require('./FileSystem');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3008;

dotenv.config(); // Carga las variables definidas en el archivo .ENV

// Funcion para eliminar acentos
function quitarAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Ruta raiz
app.get("/", (req, res) => {
  res.send("<h1>🎬Bienvenidas al servidor web Trailerflix!</h1>"); //Envia una respuesta con un mensaje HTML
});

app.get("/catalogo", async (req, res, next) => {  
  try {
     // Llamamos a la función TRAILERFLIX para obtener los datos
     const trailerflix = await TRAILERFLIX(); // Esto usa await porque estamos dentro de una funcion async
      //Estamos ordenando de manera ascendente el id
     const catalogo = trailerflix.sort((a, b) => {
        if (a.id > b.id) {
          return 1
        }
        if (a.id < b.id) {
          return -1
        }
        return 0
      });
     //devolvemos el catalogo en formato JSON
     res.json(catalogo); 
    } catch (error) {
      next(error); // Pasamos el error al middleware de errores
    }
});
 
//Ruta para buscar una pelicula por su titulo
app.get("/titulo/:title", async (req, res, next) => {
  const titulo = quitarAcentos(req.params.title.trim().toLowerCase());
      
  try {
    // Obtenemos el catalogo de peliculas y series
    const trailer = await TRAILERFLIX(); 
    // Filtramos las peliculas/series cuyo titulo contenga el texto ingresado
    const resultado = trailer.filter(flix => 
      quitarAcentos(flix.titulo.toLowerCase()).includes(titulo)
    );
      
    if (resultado.length > 0) {
      res.json(resultado);  // Devolvemos el resultado encontrado
    } else {
      res.status(404).json({ mensaje: "No se encontraron titulos que coincidan." }); // Si no se encuentra ningun resultado
    }
  } catch (error) {
    next(error); // Pasamos el error al middleware de errores
  }
});

app.get("/categoria/:cat", async (req, res, next) => {
  const categoria = quitarAcentos(req.params.cat.trim().toLowerCase());
      
  try {
    const trailer = await TRAILERFLIX();  
    // Filtramos las peliculas/series por categoria
    const resultado = trailer.filter(flix =>
      quitarAcentos(flix.categoria.toLowerCase()) === categoria
    );
      
    if (resultado.length > 0) {
      res.json(resultado); // Devolvemos los resultados encontrados
    } else {
      res.status(404).json({ mensaje: "No se encontraron contenido para esa categoria." }); 
    }
  } catch (error) {
    next(error); 
  }
});

app.get("/reparto/:act", async (req, res, next) => {
  const reparto = quitarAcentos(req.params.act.trim().toLowerCase());

  try {
    const trailer = await TRAILERFLIX();
    // Se filtran los elementos cuyo reparto coincida exactamente con el parametro
    // Luego se mapea el resultado para devolver solo el titulo y el reparto
    const resultado = trailer.filter(flix => quitarAcentos(flix.reparto.toLowerCase()).includes(reparto)).map(flix => ({
      titulo: flix.titulo,
      reparto: flix.reparto
    }));

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "No se encontro contenido con el reparto." });
    }
    
    res.json(resultado);
  } catch (error) {
    next(error); 
  }
});

app.get('/trailer/:id', async (req, res, next) => {
  const id = parseInt(req.params.id); // Convierte el parametro id a numero
  try {
    const avance = await TRAILERFLIX(); 
      
    const objeto = avance.find(flix => flix.id === id); // Busca por id
      
    if (objeto?.trailer) {
      // Si el objeto y su propiedad trailer existen
      res.json({
        id: objeto.id,
        titulo: objeto.titulo,
        trailer: objeto.trailer
      });
    } else { 
      res.status(404).json({ mensaje: "Trailer no disponible para esta pelicula o serie."});// Si no tiene trailer
    }
      
    } catch (error) {
      next(error); 
    }
});

// Middleware 404 (ruta no encontrada)
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// Middleware 500 (errores internos)
app.use((err, req, res, next) => {
  console.error(err.stack);// Muestra el stack del error en la consola
  res.status(500).json({ mensaje: "Error interno del servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciando en el puerto ${PORT}`);
});

