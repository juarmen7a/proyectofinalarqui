const express = require('express');
const router = express.Router();
const roles = require('../controllers/roles.controller');

router.get('/roles', roles.getRoles);
router.get('/roles/:id', roles.getRolById);
router.post('/roles', roles.createRol);
router.put('/roles/:id', roles.updateRol);
router.delete('/roles/:id', roles.deleteRol);

module.exports = router;
