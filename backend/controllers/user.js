const bcrypt = require('bcrypt'); // Chiffrement
const jwt = require('jsonwebtoken'); // Token 
const MaskData = require('maskdata'); // Masquage des données utilisateur
const passwordValidator = require('password-validator'); 

const User = require('../models/user'); // Model user

let schema = new passwordValidator();
schema
.is().min(8)                                  // min 8 caractères
.is().max(30)                                 // max 30 caractères
.has().uppercase()                            // Must have uppercase letters
.has().lowercase()                            // Avec minuscule
.has().digits()                               // Avec majuscule
.has().not().symbols()                        // pas de symbole   
.has().not().spaces();                        // pas d'espace  



// Inscription
exports.signup = (req, res, next) => {
  console.log(schema.validate(req.body.password));
  if(!schema.validate(req.body.password)) {
    let error = 'Attention le mot de passe n est pas valide'
    res.status(400).json({ error })
  }else {
  // Masquage de l'email
  const maskedMail = MaskData.maskEmail2(req.body.email);
  //Cryptage du MDP
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: maskedMail,
          password: hash
        });       
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    } 
  };


// Connexion
exports.login = (req, res, next) => {
  const maskedMail = MaskData.maskEmail2(req.body.email);
  // Recherche de l'utilisateur dans la BDD
  User.findOne({ email: maskedMail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // Si l'utilisateur existe comparaison du MPD avec la BDD
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Si MDP correct création d'un TOKEN de session
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

