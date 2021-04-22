const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupère le token de la requête
    const token = req.headers.authorization.split(' ')[1];
    // Décode à l'aide du TOKEN SECRET
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // Extrait l'user id du TOKEN
    const userId = decodedToken.userId;
    // Compare l'user id  du token avec celui de la requete
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};