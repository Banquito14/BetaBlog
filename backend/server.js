const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rutas = require('./routes/rutas');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Rutas del API
app.use('/api/rutas', rutas); // Asegúrate de que '/api/rutas' es la ruta correcta para tus rutas definidas en 'rutas.js'
app.use('/api/auth', authRoutes); // Asegúrate de que '/api/auth' es la ruta correcta para tus rutas definidas en 'auth.js'
app.use('/api/articulos', rutas);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
