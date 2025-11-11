//routes/empresas.routes.js
const express = require('express');
const router = express.Router();
const empresas = require('../controllers/empresas.controller');

// Rutas para la gestión de empresas
router.get('/empresas', empresas.getEmpresas);
router.get('/empresas/:id', empresas.getEmpresaById);
router.post('/empresas', empresas.createEmpresa);
router.put('/empresas/:id', empresas.updateEmpresa);
router.patch('/empresas/:id', empresas.patchEmpresa);
router.delete('/empresas/:id', empresas.deleteEmpresa);

module.exports = router;
