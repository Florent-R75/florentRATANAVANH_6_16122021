const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Function contre l'injection SQL

const validator = function (v) {
  const regex = /([<>&*()=+{}[}|\//])/;
  let function_reply = true;
  if (regex.test(v)) return (function_reply = false);
};

// Schema Mongoose, avec validation des données.

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
    validate: [validator, 'special characters are not allowed'],
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
