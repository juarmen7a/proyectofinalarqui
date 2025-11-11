//routes/movimientos.routes.js
const express = require('express');
const router = express.Router();
const movimientos = require('../controllers/movimientos.controller');

// Rutas para la gestión de movimientos
router.get('/movimientos', movimientos.getMovimientos);
router.get('/movimientos/:id', movimientos.getMovimientoById);
router.post('/movimientos', movimientos.createMovimiento);
router.put('/movimientos/:id', movimientos.updateMovimiento);
router.delete('/movimientos/:id', movimientos.deleteMovimiento);

module.exports = router;
