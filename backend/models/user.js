const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email

// structure du modèle user demandé
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique = une adresse mail unique
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // utilisation du package

module.exports = mongoose.model('User', userSchema);