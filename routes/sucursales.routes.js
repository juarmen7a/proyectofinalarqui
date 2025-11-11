//routes/sucursales.routes.js
const express = require('express');
const router = express.Router();
const sucursales = require('../controllers/sucursales.controller');

// Rutas para la gestión de sucursales
router.get('/sucursales', sucursales.getSucursales);
router.get('/sucursales/:id', sucursales.getSucursalById);
router.post('/sucursales', sucursales.createSucursal);
router.put('/sucursales/:id', sucursales.updateSucursal);
router.delete('/sucursales/:id', sucursales.deleteSucursal);

module.exports = router;
