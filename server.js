const express = require('express');
const TRAILERFLIX = require('./FileSystem');
const app = express();
const PORT = process.env.PORT || 3008;

//Ruta raiz
app.get("/", (req, res) => {
  res.send("<h1>Bienvenidas al servidor web Trailerflix!</h1>"); //Envía una respuesta al cliente con un mensaje HTML
});

app.get("/catalogo", async (req, res) => {  
  try {
     // Llamamos a la función TRAILERFLIX para obtener los datos
     const trailerflix = await TRAILERFLIX(); // Esto usa await correctamente porque estamos dentro de una función async
      //Estamos ordenando de manera ascendente el id
     const catalogo = trailerflix.sort((a, b) => {
      return a.id - b.id;
     })
     // Si todo sale bien, devolvemos el catálogo en formato JSON
     res.json(trailerflix); 
    } catch (error) {
     // Si ocurre un error inesperado, se devuelve un estado 500 (error del servidor)
     res.status(500).json({ mensaje: 'Error al cargar el catálogo.'});
    }
});
 
//Ruta para buscar una pelicula por su titulo
app.get("/titulo/:title", async (req, res) => {
  const title = req.params.title.trim().toLowerCase();
      
  try {
    const trailer = await TRAILERFLIX(); // Obtenemos el catálogo de películas y series
    // Filtramos las películas/series cuyo título contenga el texto ingresado
    const resultado = trailer.filter(flix => 
      flix.titulo.toLowerCase() === title
    );
      
    if (resultado.length > 0) {
      res.json(resultado);  // Devolvemos los resultados encontrados
    } else {
      res.status(404).json({ mensaje: 'No se encontraron títulos que coincidan.' }); // Si no encontramos nada
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el título.'});
  }
});

app.get("/categoria/:cat", async (req, res) => {
  const categoria = req.params.cat.trim().toLowerCase();
      
  try {
    const trailer = await TRAILERFLIX();  // Obtenemos el catálogo de películas/series
    // Filtramos las películas/series por categoría
    const resultado = trailer.filter(flix =>
      flix.categoria.toLowerCase() === categoria
    );
      
    if (resultado.length > 0) {
      res.json(resultado); // Si encontramos resultados, los devolvemos en formato JSON
    } else {
      res.status(404).json({ mensaje: 'No se encontraron contenido para esa categoría.' });  // Si no hay contenido
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar por categoría.'});
  }
});

app.get("/reparto/:act", async (req, res) => {
  const reparto = req.params.act.trim().toLowerCase();

  try {
    const trailer = await TRAILERFLIX();
    // Se filtran los elementos cuyo reparto coincida exactamente con el parámetro
    // Luego se mapea el resultado para devolver solo el título y el reparto
    const resultado = trailer.filter(flix => flix.reparto.toLowerCase() === reparto).map(flix => ({
      titulo: flix.titulo,
      reparto: flix.reparto
    }));

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: `No se encontró contenido con el reparto.` });
    }
    
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar por reparto.'});
  }
});

app.get('/trailer/:id', async (req, res) => {
  const id = parseInt(req.params.id); // Convierte el parámetro id a número
  try {
    const trailer = await TRAILERFLIX(); // Carga el catálogo completo
      
    const objeto = trailer.find(flix => flix.id === id); // Busca por id
      
    if (objeto?.trailer) {
      // Si el objeto y su propiedad trailer existen
      res.json({
        id: objeto.id,
        titulo: objeto.titulo,
        trailer: objeto.trailer
      });
    } else {
      // Si no tiene trailer
      res.status(404).json({ mensaje: "Trailer no disponible para esta película o serie."});
    }
      
    } catch (error) {
      res.status(500).json({ mensaje: "Error al acceder al catálogo."});
    }
});
      

app.listen(PORT, () => {
  console.log(`Servidor iniciando en el puerto ${PORT}`);
});

