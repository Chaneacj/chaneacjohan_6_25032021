const Sauce = require('../models/sauce');
const fs = require('fs');

// POST - Créer et ajoute une nouvelle 'sauce' dans la BDD 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,     
    });

    //Sauvegarde dans la BDD
    sauce.save() 
    .then( () => res.status(201).json({ message: 'Sauce saved'}))
    .catch( error => res.status(400).json({ error }))
};

// GET - Recupérer UN objet de la BDD
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// PUT - Modifier UN objet de la BDD
exports.modifySauce = (req, res, next) => {
    if (req.file) {//Si une nouvelle image est reçue dans la requête
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const fileName = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${fileName}`, (err => { //On supprime l'ancienne image
                    if (err) console.log(err);
                    else {
                        console.log("Image supprimée: " + fileName);
                    }
                }))
            })
      } 
    const sauceObject = req.file ? { //On verifie si la req contient un fichier
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Si la requete contient un fichier on traite la nouvelle image
    } : {
        ...req.body // Si la req n'a pas de fichier on envoi seulement le contenu modifier
    };
    //On effectu la modification
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};




// DELETE - Supprimer UN objet de la BDD
exports.deleteSauce = (req, res, next) => {
    //On cherche l'objet correspondant à l'id dans la BDD
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            //On extrait le nom du fichier depuis l'url
            const filename = sauce.imageUrl.split('/images/')[1];
            //On supprime le fichier du server
            fs.unlink(`images/${filename}`, () => {
                //Puis on supprime l'objet de la BDD
                sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};


//GET - Récupérer TOUS les objets de la BDD
exports.getAllSauces = (req, res, next) => { 
    console.log('route ok')
    Sauce.find()
    .then( sauces => {
        res.status(200).json(sauces) 
        console.log(sauces)
    })
    .catch( error => {
        res.status(400).json({ error })
        console.log(error)
    })
};
  