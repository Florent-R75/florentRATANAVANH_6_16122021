const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const sauceRoutes = require('./routes/sauceRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

//  MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connection Mongoose.

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
app.use(helmet());
app.use(mongoSanitize({
  
  onSanitize: ({ req, key }) => {
    console.warn(`This request[${key}] is sanitized`, req);
    console.log('sanitize*********');
  },
}));

// Configuration des routes

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
