const express = require('express');
const router = express.Router();
const almacenes = require('../controllers/almacenes.controller');

router.get('/almacenes',        almacenes.getAlmacenes);
router.get('/almacenes/:id',    almacenes.getAlmacenById);
router.post('/almacenes',       almacenes.createAlmacen);
router.put('/almacenes/:id',    almacenes.updateAlmacen);
router.delete('/almacenes/:id', almacenes.deleteAlmacen);

module.exports = router;
