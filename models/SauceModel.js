const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: [true, 'A sauce must have a name'] },
	manufacturer: { type: String, required: [true, 'A manufacturer must have a name'] },
	description: { type: String, required: [true, 'A description is required'] },
	mainPepper: { type: String, required: [true, 'A main pepper is required'] },
	imageUrl: { type: String, required: [true, 'An image is required'] },
	heat: { type: Number, required: [true, 'A sauce must have a heat'] },
	likes: { type: Number, required: false },
	dislikes: { type: Number, required: false },
	usersLiked: { type: Array, required: false },
	usersDisliked: { type: Array, required: false }
});

module.exports = mongoose.model("SauceModel", sauceSchema);
