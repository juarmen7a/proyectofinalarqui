'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/detalleventas.controller');

// Obtener todos los detalles
router.get('/detalleventas', ctrl.getDetalleVentas);

// Obtener detalle por ID
router.get('/detalleventas/:id', ctrl.getDetalleVentaById);

// Obtener detalles por venta
router.get('/ventas/:venta_id/detalleventas', ctrl.getDetallesByVenta);

// Crear detalle
router.post('/detalleventas', ctrl.createDetalleVenta);

// Actualizar detalle
router.put('/detalleventas/:id', ctrl.updateDetalleVenta);

// Eliminar detalle
router.delete('/detalleventas/:id', ctrl.deleteDetalleVenta);

module.exports = router;
