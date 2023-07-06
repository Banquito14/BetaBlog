const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rutas = require('./routes/rutas');
const auth = require('./routes/auth')

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/blog2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión exitosa a la base de datos');

    // Prueba de conexión: Imprimir lista de colecciones
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
      if (err) {
        console.error('Error al obtener las colecciones:', err);
      } else {
        console.log('Colecciones disponibles:');
        collections.forEach(function (collection) {
          console.log(collection.name);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Rutas del API
app.use('/api/articulos', rutas);
app.use('/auth', auth);
// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
