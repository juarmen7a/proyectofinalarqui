const express = require('express');
const router = express.Router();
const categorias = require('../controllers/categorias.controller');

router.get('/categorias', categorias.getCategorias);
router.get('/categorias/:id', categorias.getCategoriaById);
router.post('/categorias', categorias.createCategoria);
router.put('/categorias/:id', categorias.updateCategoria);
router.delete('/categorias/:id', categorias.deleteCategoria);

module.exports = router;
