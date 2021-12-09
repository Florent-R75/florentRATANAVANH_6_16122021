const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const validator = function (v) {
    const regex = /([<>\/])/;
    let function_reply = true;
    if (regex.test(v)) return (function_reply = false);
  };

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Une adresse email est nécessaire'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Entrez une adresse email valide',
    ],
    minlength: [5, 'An email must be more or equal than 2 characters'],
    maxlength: [20, 'An email must be at less or equal than 20 characters'],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'An email must be more or equal than 8 characters'],
    maxlength: [20, 'An email must be less or equal than 20 characters'],
    validate: [validator, 'Theses characters are not allowed:([<>\/])']
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
