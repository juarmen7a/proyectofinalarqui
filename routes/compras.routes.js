'use strict';

const express = require('express');
const router = express.Router();
const compras = require('../controllers/compras.controller');

router.get('/compras', compras.getCompras);
router.get('/compras/:id', compras.getCompraById);
router.post('/compras', compras.createCompra);
router.put('/compras/:id', compras.updateCompra);
router.delete('/compras/:id', compras.deleteCompra);

module.exports = router;
