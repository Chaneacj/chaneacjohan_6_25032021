//importe express
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

require('dotenv').config();
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
//appeller la méthode express
const app = express();

app.use(mongoSanitize());
app.use(helmet());

//Connexion à la base de donnée
mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.qqt5a.mongodb.net/projet6?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS - partage de ressources entre serveurs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //API accessible depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Indiquer les methodes authorisées
    next();
});

//Rend les données du corps de la requête exploitable
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//exporte pour rentre acceccible des autres fichiers
module.exports = app;