//routes/ventas.routes.js
const express = require('express');
const router = express.Router();
const ventas = require('../controllers/ventas.controller');

// Rutas para la gestión de ventas
router.get('/ventas', ventas.getVentas);
router.get('/ventas/:id', ventas.getVentaById);
router.post('/ventas', ventas.createVenta);
router.put('/ventas/:id', ventas.updateVenta);
router.delete('/ventas/:id', ventas.deleteVenta);

module.exports = router;
