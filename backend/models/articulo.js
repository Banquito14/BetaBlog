const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: true,
  },
});

const Articulo = mongoose.model('Articulo', articleSchema);

module.exports = Articulo;
