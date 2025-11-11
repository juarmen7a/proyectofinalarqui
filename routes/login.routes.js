const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

// Rutas con prefijo /login
router.get('/login/verificar/token', loginController.verificarToken);
router.get('/login', loginController.getSesiones);
router.get('/login/:id', loginController.getSesionById);
router.post('/login', loginController.createSesion);
router.put('/login/:id', loginController.updatePassword);
router.delete('/login/:id', loginController.deleteSesion);

module.exports = router;
