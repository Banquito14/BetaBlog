const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  imagenURL: {
    type: String,
    required: true,
  },
});

const Articulo = mongoose.model('Articulo', articuloSchema);

module.exports = Articulo;
