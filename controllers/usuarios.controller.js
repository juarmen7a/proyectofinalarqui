// controllers/usuarios.controller.js
const Usuario = require('../models/usuarios.model');

// Obtiene todos los usuarios
exports.getUsuarios = async (req, res) => {
  try { res.json(await Usuario.findAll()); }
  catch (error) { res.status(500).json({ error, message: 'Error al obtener usuarios' }); }
};

// Obtiene un usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const row = await Usuario.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener usuario' });
  }
};

// Crea un nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const { sucursal_id, nombre_completo, correo, contrasena, activo } = req.body;
    const row = await Usuario.create({ sucursal_id, nombre_completo, correo, contrasena, activo });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al crear usuario' });
  }
};

// Actualiza un usuario existente
exports.updateUsuario = async (req, res) => {
  try {
    const row = await Usuario.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { sucursal_id, nombre_completo, correo, contrasena, activo } = req.body;
    row.sucursal_id = sucursal_id ?? row.sucursal_id;
    row.nombre_completo = nombre_completo ?? row.nombre_completo;
    row.correo = correo ?? row.correo;
    row.contrasena = contrasena ?? row.contrasena;
    row.activo = (activo ?? row.activo);
    await row.save();
    res.json(row);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al actualizar usuario' });
  }
};


// Elimina un usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const row = await Usuario.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    await row.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error, message: 'Error al eliminar usuario' });
  }
};
