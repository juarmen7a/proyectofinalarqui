//routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuarios = require('../controllers/usuarios.controller');

// Rutas para la gestión de usuarios
router.get('/usuarios', usuarios.getUsuarios);
router.get('/usuarios/:id', usuarios.getUsuarioById);
router.post('/usuarios', usuarios.createUsuario);
router.put('/usuarios/:id', usuarios.updateUsuario);
router.delete('/usuarios/:id', usuarios.deleteUsuario);

module.exports = router;
