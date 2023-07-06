const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

exports.register = async (req, res) => {
  try {
    const { nombreUsuario, correoElectronico, contrasena } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ correoElectronico });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Crear una nueva instancia de usuario con los datos recibidos
    const nuevoUsuario = new Usuario({ nombreUsuario, correoElectronico, contrasena });

    // Cifrar la contraseña antes de guardarla en la base de datos
    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.contrasena = await bcrypt.hash(nuevoUsuario.contrasena, salt);


    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correoElectronico, contrasena } = req.body;

    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ correoElectronico });
    if (!usuario) {
      return res.status(404).json({ message: 'El usuario no está registrado' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token de autenticación
    const token = jwt.sign({ userId: usuario._id }, 'secreto', { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
