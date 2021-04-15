const mongoose = require('mongoose');

// structure du modèle sauce demandé
const sauceSchema = mongoose.Schema({ 
    userId: { type: String },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    usersLiked: {type: Array},
    usersDisliked: {type: Array },
    
});
module.exports = mongoose.model('Sauce', sauceSchema);