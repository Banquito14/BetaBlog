const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: { type: String, required: true },
  correoElectronico: { type: String, required: true },
  contrasena: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
