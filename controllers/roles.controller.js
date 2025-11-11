// controllers/roles.controller.js
const Rol = require('../models/roles.model');
const UsuarioRol = require('../models/usuarioroles.model');

// Obtiene todos los roles
exports.getRoles = async (req, res) => {
  try {
    const rows = await Rol.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error: error.message });
  }
};

// Obtiene un rol por ID
exports.getRolById = async (req, res) => {
  try {
    const row = await Rol.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rol', error: error.message });
  }
};

// Crea un nuevo rol
exports.createRol = async (req, res) => {
  try {
    const { nombre } = req.body;
    const row = await Rol.create({ nombre });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear rol', error: error.message });
  }
};

// Actualiza un rol existente
exports.updateRol = async (req, res) => {
  try {
    const row = await Rol.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Rol no encontrado' });

    const { nombre } = req.body;
    row.nombre = nombre ?? row.nombre;
    await row.save();

    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar rol', error: error.message });
  }
};

// Elimina un rol
exports.deleteRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id);
    if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });

    // Verifica usuarios asignados antes de eliminar
    const asignadosPrevios = await UsuarioRol.count({ where: { rol_id: id } });
    const nombreRol = rol.nombre;
    await rol.destroy();
    const rolesRestantes = await Rol.count();

    return res.status(200).json({
      message: `Rol "${nombreRol}" Eliminado correctamente.`,
      usuarios_asignados_previos: asignadosPrevios,
      roles_restantes: rolesRestantes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rol', error: error.message });
  }
};
