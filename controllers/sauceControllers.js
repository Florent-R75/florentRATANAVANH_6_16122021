const Sauce = require('../models/SauceModel');

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
	res.status(200).json({
		status:'Succès',
		message:'La sauce été modifié '
	});
};

// Delete => Reponse

exports.deleteSauce = (req, res, next) => {
	res.status(200).json({
		status:'Succès',
		message:'La sauce été supprimée '
	});
};

// Likes => Réponse

exports.likeSauce = (req, res, next) => {
	res.status(200).json({
		status:'Succès',
		message:'Votre like ou dislike a bien été pris en compte'
	});
};



