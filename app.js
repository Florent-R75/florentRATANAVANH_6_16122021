const express = require('express');
const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sauceRoutes = require('./routes/sauceRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

//  MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --------MONGO DB------------------

// mongoose
//   .connect(
//     'mongodb+srv://FlorentR:9G4my7iTwLZyScSf@cluster0.eeqyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'));

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// ------DEFINITION DES HEADERS----------

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

// Configuration des routes

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// GESTION ERREURS

app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'echec',
  //     message: `Impossible de trouver ${req.originalUrl} sur ce serveur!`
  //   });

  const err = new Error(
    `Impossible de trouver ${req.originalUrl} sur ce serveur!`
  );
  err.status = 'echec';
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
