const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const validator = function (v) {
  const regex = /([<>\/])/;
  let function_reply = true;
  if (regex.test(v)) return (function_reply = false);
};

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    required: [true, 'Une sauce doit avoir un nom'],
    minlength: [2, 'A sauce must have more or equal than 2 characters'],
    maxlength: [15, 'A sauce must have less or equal than 15 characters'],
    trim: true,
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  manufacturer: {
    type: String,
    required: [true, 'A manufacturer must have a name'],
    minlength: [
      2,
      'A manufacturer name must have more or equal than 2 characters',
    ],
    maxlength: [
      15,
      'A manufacturer name must have less or equal than 15 characters',
    ],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  description: {
    type: String,
    required: [true, 'A description is required'],
    maxlength: [300, 'A sauce must have less or equal than 15 characters'],
    minlength: [2, 'A sauce must have more or equal than 2 characters'],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  mainPepper: { type: String, required: [true, 'A main pepper is required'] },
  imageUrl: { type: String, required: false },
  heat: {
    type: Number,
    required: [true, 'A sauce must have a heat'],
    default: 1,
    min: [1, 'A heat must be above 1'],
    max: [10, 'A heat must be below than 10'],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  likes: {
    type: Number,
    default: 0,
    enum: [1, 0, 'Only One like or dislike is authorized'],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  dislikes: {
    type: Number,
    default: 0,
    enum: [-1, 0, 'Only One like or dislike is authorized'],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  usersLiked: { type: Array, validate: [validator, 'Theses characters are not allowed:([<>\/])'] }, 
  usersDisliked: { type: Array, validate: [validator, 'Theses characters are not allowed:([<>\/])'] },

});

module.exports = mongoose.model('Sauce', sauceSchema);
