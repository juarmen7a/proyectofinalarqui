'use strict';
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');

router.get('/inventario', inventarioController.getInventarios);
router.get('/inventario/:id', inventarioController.getInventarioById);
router.post('/inventario', inventarioController.createInventario);
router.put('/inventario/:id', inventarioController.updateInventario);
router.delete('/inventario/:id', inventarioController.deleteInventario);

module.exports = router;
