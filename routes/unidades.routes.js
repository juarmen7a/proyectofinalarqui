const express = require('express');
const router = express.Router();
const unidades = require('../controllers/unidades.controller');

router.get('/unidades', unidades.getUnidades);
router.get('/unidades/:id', unidades.getUnidadById);
router.post('/unidades', unidades.createUnidad);
router.put('/unidades/:id', unidades.updateUnidad);
router.delete('/unidades/:id', unidades.deleteUnidad);

module.exports = router;
