const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

router.get('/usuarios', async (req, res) => {
  try {
  const usuarios = await Usuario.find();
  res.status(200).json({ usuarios });
  } catch (error) {
  console.log(error);
  res.status(500).json({ mensaje: 'Error en el servidor' });
  }
  });
router.post('/registro', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Verificar si el usuario ya existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }
    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({ username, password });
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.password = await bcrypt.hash(password, salt);
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Registro exitoso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }
    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(password, usuario.password);
    if (contraseñaValida) {
      // Generar el token de autenticación
      const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '1h' });
      console.log('Token de autenticación:', token);
      res.status(200).json({ token });
    } else {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    // Buscar y actualizar el usuario por su ID
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { username, password },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar el usuario por su ID
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
