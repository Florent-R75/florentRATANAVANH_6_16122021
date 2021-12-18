const jwt = require('jsonwebtoken');
const Sauce = require('../models/SauceModel');

// AUTORISATION ET CONTROLE D'ACCES DES PERMISSIONS. 
// On recupere l'id en decodant le token envoye par le front, et on compare les id pour autoriser uniquement le proprietaire de la sauce

module.exports = (req, res, next) => {
  try {
    

    Sauce.findById({ _id: req.params.id })
      .then((sauce) => {
        

        if ( sauce.userId === req.body.decodedToken) next();
        else {
          res.status(403).json({
            message: ' 403: unauthorized request. !',
          });
        }
      })
      .catch((error) => res.status(404).json({ error }));
  } catch {
    res.status(401).json({
      error: new Error(),
    });
  }
};
