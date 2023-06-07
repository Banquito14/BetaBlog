// backend/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Carpeta donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    cb(null, filename); // Nombre de archivo único
  },
});

// Configuración de multer para la subida de imágenes
const upload = multer({ storage: storage });

// Configura el servidor de Express
const app = express();
app.use(express.json());
app.use(cors());

// Configura la conexión con la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos'));
db.once('open', () => {
  console.log('Conectado a la base de datos');
});

// Configura las rutas de los artículos
const articuloRutas = require('./routes/rutas');
app.use('/articulos', articuloRutas);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Verifica si es un error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ error: errors });
  }

  // Otros errores
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
