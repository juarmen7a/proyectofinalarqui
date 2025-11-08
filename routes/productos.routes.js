const express = require('express');
const router = express.Router();
const productos = require('../controllers/productos.controller');

router.get('/productos', productos.getProductos);
router.get('/productos/:id', productos.getProductoById);
router.post('/productos', productos.createProducto);
router.put('/productos/:id', productos.updateProducto);
router.delete('/productos/:id', productos.deleteProducto);

module.exports = router;
