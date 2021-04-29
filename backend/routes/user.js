const express = require('express');
// Création du router
const router = express.Router();

// Liaison du contoller
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;