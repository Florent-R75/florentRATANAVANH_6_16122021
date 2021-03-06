const Sauce = require('../models/SauceModel');
const fs = require('fs');

// Creation de la sauce

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

// Modification de la sauce, et validation des données

exports.updateSauce = (req, res, next) => {
  // Si l'utilisateur ne modifie pas l'image

  if (!req.file) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        _id: req.params.id,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
      },
      { runValidators: true }
    )
      .then((sauce) =>
        res
          .status(200)
          .json({ message: 'Votre modification a bien ete pris en compte' })
      )
      .catch((error) => res.status(404).json({ error }));
  } else {
    

    // Recherche du chemin  et suppression de l'image de la sauce

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => err);
    });
    // Modification du nouvel objet, et creation d'une nouvelle imageURL
    Sauce.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        _id: req.params.id,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      },
      { runValidators: true }
    )
      .then((sauce) =>
        res
          .status(200)
          .json({ message: 'Votre image a bien ete pris en compte' })
      )
      .catch((error) => res.status(404).json({ error }));
  }
};

// Suppression de la sauce et de son image

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => err);
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch((error) => res.status(400).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};

// Like et Dislike de la sauce, gestion des tableaux et mise a jour des compteurs.

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const arrayLiked = sauce.usersLiked;
      const arrayDisliked = sauce.usersDisliked;

      const indexOfUserLiked = arrayLiked.indexOf(req.body.userId);
      const indexOfUserDisliked = arrayDisliked.indexOf(req.body.userId);

      // Si l'utilisateur like pour la 1er fois

      if (
        !arrayLiked.includes(req.body.userId) &&
        !arrayDisliked.includes(req.body.userId) &&
        req.body.like === 1
      ) {
        arrayLiked.push(req.body.userId);
        sauce.likes = arrayLiked.length;

        sauce
          .save()
          .then(
            res.status(200).json({
              status: 'succès',
              message: 'Votre avis a été pris en compte',
            })
          )
          .catch((err) => res.status(400).json({ error }));
      }

      // Si l'utilisateur annule son like
      else if (
        arrayLiked.includes(req.body.userId) &&
        !arrayDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        arrayLiked.splice(indexOfUserLiked, 1);
        sauce.likes = arrayLiked.length;

        sauce
          .save()
          .then(
            res.status(200).json({
              status: 'succès',
              message: 'Votre modification a été prise en compte',
            })
          )
          .catch((err) => res.status(400).json({ error }));
      }

      
      
      // Si l'utilisateur dislike pour la 1er fois
      else if (
        !arrayLiked.includes(req.body.userId) &&
        !arrayDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        arrayDisliked.push(req.body.userId);
        sauce.dislikes = arrayDisliked.length;

        sauce
          .save()
          .then(
            res.status(200).json({
              status: 'succès',
              message: 'Votre avis a été pris en compte',
            })
          )
          .catch((err) => res.status(400).json({ error }));}
      
      // si l'utilisateur annule son dislike
      else if (
        arrayDisliked.includes(req.body.userId) &&
        !arrayLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        arrayDisliked.splice(indexOfUserDisliked, 1);
        sauce.dislikes = arrayDisliked.length;

        sauce
          .save()
          .then(
            res.status(200).json({
              status: 'succès',
              message: 'Votre modification a été prise en compte',
            })
          )
          .catch((err) => res.status(400).json({ error }));
      }
      
      
      
          else {
        res.status(200).json({
          statut: 'null',
          message: 'Vous avez deja donnée votre avis',
        });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
