//routes/detalleventas.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/detalleventas.controller');

// Rutas para la gestión de detalles de venta
router.get('/detalleventas', ctrl.getDetalleVentas);
router.get('/detalleventas/:id', ctrl.getDetalleVentaById);
router.get('/ventas/:venta_id/detalleventas', ctrl.getDetallesByVenta);
router.post('/detalleventas', ctrl.createDetalleVenta);
router.put('/detalleventas/:id', ctrl.updateDetalleVenta);
router.delete('/detalleventas/:id', ctrl.deleteDetalleVenta);

module.exports = router;
