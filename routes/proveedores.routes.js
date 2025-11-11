//routes/proveedores.routes.js
const express = require('express');
const router = express.Router();
const proveedores = require('../controllers/proveedores.controller');

// Rutas para la gestión de proveedores
router.get('/proveedores', proveedores.getProveedores);
router.get('/proveedores/:id', proveedores.getProveedorById);
router.post('/proveedores', proveedores.createProveedor);
router.put('/proveedores/:id', proveedores.updateProveedor);
router.delete('/proveedores/:id', proveedores.deleteProveedor);

module.exports = router;
