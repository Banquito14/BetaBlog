const express = require('express');
const router = express.Router();
const Articulo = require('../models/articulo');
const { getPosts } = require('./api');

// Obtener todos los artículos
router.get('/', async (req, res) => {
  try {
    const articulos = await Articulo.find();
    res.json(articulos);
  } catch (error) {
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
    res.status(500).json({ error: 'Error al obtener el artículo' });
  }
});

// Crear un nuevo artículo
router.post('/', async (req, res) => {
  try {
    const article = new Articulo(req.body);
    const savedArticulo = await article.save();
    res.status(201).json(savedArticulo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el artículo' });
  }
});

// Actualizar un artículo existente
router.put('/:id', async (req, res) => {
  try {
    const article = await Articulo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el artículo' });
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
    res.status(400).json({ error: 'Error al eliminar el artículo' });
  }
});
// Agrega la imagen a un artículo existente
router.put('/:id/image', upload.single('image'), async (req, res) => {
  try {
    const article = await Articulo.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    // Actualiza la propiedad de imageUrl del artículo con la ruta del archivo subido
    article.imageUrl = req.file.path;
    const savedArticle = await article.save();

    res.json(savedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la imagen al artículo' });
  }
});


module.exports = router;
