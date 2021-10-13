const Sauce = require("../models/SauceModel");

exports.createSauces = (req, res, next) => {
	delete req.body._id;
	const sauce = new Sauce({
		...req.body
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Objet enregistré !" }))
		.catch(error => res.status(400).json({ error }));
};

exports.listSauces = (req, res, next) => {
	Sauce.find()
		.then(sauces => res.status(200).json(sauces))
		.catch(error => res.status(400).json({ error }));
};
