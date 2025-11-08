const express = require('express');
const router = express.Router();
const usuarioRoles = require('../controllers/usuarioroles.controller');

router.get('/usuario-roles', usuarioRoles.getUsuarioRoles);
router.get('/usuario-roles/:id', usuarioRoles.getUsuarioRolById);
router.post('/usuario-roles', usuarioRoles.createUsuarioRol);
router.put('/usuario-roles/:id', usuarioRoles.updateUsuarioRol);
router.delete('/usuario-roles/:id', usuarioRoles.deleteUsuarioRol);

module.exports = router;
