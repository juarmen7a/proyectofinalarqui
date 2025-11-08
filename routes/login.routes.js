const express = require('express');
const router = express.Router();
const login = require('../controllers/login.controller');

router.post('/login', login.createSesion);
router.get('/sesiones', login.getSesiones);
router.get('/sesiones/:id', login.getSesionById);
router.delete('/logout', login.logout);
router.get('/verificar', login.verificarToken);

module.exports = router;
