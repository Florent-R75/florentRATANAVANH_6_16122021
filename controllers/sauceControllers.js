const Sauce = require('../models/SauceModel');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Affichage de toutes les sauces

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Affichage d'une seule sauce

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Update => Reponse

exports.updateSauce = (req, res, next) => {
  // Si l'utilisateur ne modifie pas l'image

  if (!req.file) {
    Sauce.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id },
      { runValidators: true }
    )
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
  } else {
    const sauceObject = JSON.parse(req.body.sauce);

    // Recherche du chemin de l'image de l'objet et suppression de l'image
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => err);
    });
    // Modification du nouvel objet, et creation d'une nouvelle imageURL
    Sauce.updateOne(
      { _id: req.params.id },
      {
        ...sauceObject,
        _id: req.params.id,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      },
      { runValidators: true }
    )
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
  }
};

// Delete Middleware

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const arrayLiked = sauce.usersLiked;
      const arrayDisliked = sauce.usersDisliked;

      const indexOfUserLiked = arrayLiked.indexOf(req.body.userId);
      const indexOfUserDisliked = arrayDisliked.indexOf(req.body.userId);

      // Si l'utilisateur like pour la 1er fois

      if (!arrayLiked.includes(req.body.userId) && req.body.like == 1) {
        arrayLiked.push(req.body.userId);
        sauce.likes = arrayLiked.length;

        sauce.save();
      }

      // Si l'utilisateur annule son like

      if (arrayLiked.includes(req.body.userId) && req.body.like == 0) {
        arrayLiked.splice(indexOfUserLiked);
        sauce.likes = arrayLiked.length;

        sauce.save();
      }

      // si l'utilisateur annule son dislike
      else if (arrayDisliked.includes(req.body.userId) && req.body.like == 0) {
        arrayDisliked.splice(indexOfUserDisliked);
        sauce.dislikes = arrayDisliked.length;

        sauce.save();
      }

      // Si l'utilisateur dislike
      else if (
        !arrayDisliked.includes(req.body.userId) &&
        req.body.like == -1
      ) {
        arrayDisliked.push(req.body.userId);
        sauce.dislikes = arrayDisliked.length;

        sauce.save();
      } else {
        console.log('vous avez deja donnée votre avis');
        return res.status(500);
      }

      res.status(200).json({
        status: 'succès',
        message: 'Votre avis a été pris en compte',
      });
    })
    .catch((error) => res.status(404).json({ error }));
};
