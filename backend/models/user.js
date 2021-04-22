const mongoose = require('mongoose');
// Package qui valide l'unicité de l'email
const uniqueValidator = require('mongoose-unique-validator'); 

// Structure du modèle user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique = une adresse mail unique
  password: { type: String, required: true }
});

// Appel le Package 
userSchema.plugin(uniqueValidator); 

module.exports = mongoose.model('User', userSchema);