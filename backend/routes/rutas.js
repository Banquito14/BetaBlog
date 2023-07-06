const express = require('express');
const router = express.Router();
const Articulo = require('../models/articulo');

// Obtener todos los artículos
router.get('/', async (req, res) => {
  try {
    const articulos = await Articulo.find();
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
});

// Obtener un artículo por su ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Articulo.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el artículo' });
  }
});
// Crear un nuevo artículo
router.post('/', async (req, res) => {
  try {
    // Validación de entrada
    if (!req.body.titulo || !req.body.contenido || !req.body.autor || !req.body.imagenURL) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const article = new Articulo(req.body);
    const savedArticulo = await article.save();
    res.status(201).json(savedArticulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el artículo' });
  }
});
// Actualizar un artículo existente
router.put('/:id', async (req, res) => {
  try {
    const article = await Articulo.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    // Validación de entrada
    if (!req.body.titulo || !req.body.contenido || !req.body.autor) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    // Actualizar solo los campos permitidos
    article.titulo = req.body.titulo;
    article.contenido = req.body.contenido;
    article.autor = req.body.autor;
    const savedArticle = await article.save();
    res.json(savedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el artículo' });
  }
});
// Eliminar un artículo existente
router.delete('/:id', async (req, res) => {
  try {
    const article = await Articulo.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    res.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el artículo' });
  }
});
// Agregar la imagen a un artículo existente
router.post('/imagen/:id', async (req, res) => {
  try {
    // Obtén la URL de la imagen del cuerpo de la solicitud
    const { imagenURL } = req.body;

    // Busca el artículo por su ID
    const article = await Articulo.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    // Asigna la URL de la imagen al campo 'imagen'
    article.imagenURL = imagenURL;
    
    // Guarda el artículo actualizado en la base de datos
    const savedArticle = await article.save();

    res.status(201).json(savedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el artículo' });
  }
});



module.exports = router;