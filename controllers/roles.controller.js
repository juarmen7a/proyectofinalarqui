'use strict';

const Rol = require('../models/roles.model');
const UsuarioRol = require('../models/usuarioroles.model');

exports.getRoles = async (req, res) => {
  try {
    const rows = await Rol.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error: error.message });
  }
};

exports.getRolById = async (req, res) => {
  try {
    const row = await Rol.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rol', error: error.message });
  }
};

exports.createRol = async (req, res) => {
  try {
    const { nombre } = req.body;
    const row = await Rol.create({ nombre });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear rol', error: error.message });
  }
};

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

exports.deleteRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id);
    if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });

    const asignadosPrevios = await UsuarioRol.count({ where: { rol_id: id } });

    // Si quieres bloquear cuando hay usuarios asignados, descomenta esto:
    // if (asignadosPrevios > 0) {
    //   return res.status(409).json({
    //     message: `No se puede eliminar el rol "${rol.nombre}" porque tiene ${asignadosPrevios} usuario(s) asignado(s).`
    //   });
    // }

    const nombreRol = rol.nombre;
    await rol.destroy();

    const rolesRestantes = await Rol.count();

    return res.status(200).json({
      message: `Rol "${nombreRol}" eliminado correctamente.`,
      usuarios_asignados_previos: asignadosPrevios,
      roles_restantes: rolesRestantes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rol', error: error.message });
  }
};
