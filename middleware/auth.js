const jwt = require('jsonwebtoken');
const SauceModel = require('../models/SauceModel');

// Decodage du token renvoyé par le front, stockage de l'id du user et comparaison avec l'id fourni par la requete.

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    let userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw new Error();
    } else {
      req.body.decodedToken = userId;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error(),
      message: 'Requête non authentifiée !',
    });
  }
};
