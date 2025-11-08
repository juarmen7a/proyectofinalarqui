'use strict';

const UsuarioRol = require('../models/usuarioroles.model');
const Usuario = require('../models/usuarios.model');
const Rol = require('../models/roles.model');

exports.getUsuarioRoles = async (req, res) => {
  try {
    const rows = await UsuarioRol.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario_roles', error: error.message });
  }
};

exports.getUsuarioRolById = async (req, res) => {
  try {
    const row = await UsuarioRol.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Registro usuario_rol no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario_rol', error: error.message });
  }
};

exports.createUsuarioRol = async (req, res) => {
  try {
    const { usuario_id, rol_id } = req.body;

    const [usuario, rol] = await Promise.all([
      Usuario.findByPk(usuario_id),
      Rol.findByPk(rol_id)
    ]);

    if (!usuario) return res.status(404).json({ message: `Usuario ${usuario_id} no existe` });
    if (!rol) return res.status(404).json({ message: `Rol ${rol_id} no existe` });

    const existe = await UsuarioRol.findOne({ where: { usuario_id, rol_id } });
    if (existe) {
      return res.status(409).json({
        message: `El usuario ${usuario_id} ya tiene asignado el rol "${rol.nombre}" (${rol_id})`
      });
    }

    const row = await UsuarioRol.create({ usuario_id, rol_id });
    res.status(201).json({
      message: `Asignado rol "${rol.nombre}" a usuario ${usuario_id}`,
      data: row
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Referencia inválida: verifica usuario_id y rol_id',
        detalle: error.parent?.sqlMessage || error.message
      });
    }
    res.status(500).json({ message: 'Error al crear usuario_rol', error: error.message });
  }
};

exports.updateUsuarioRol = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await UsuarioRol.findByPk(id);
    if (!row) return res.status(404).json({ message: 'Registro usuario_rol no encontrado' });

    const { usuario_id, rol_id } = req.body;

    if (usuario_id !== undefined) {
      const u = await Usuario.findByPk(usuario_id);
      if (!u) return res.status(404).json({ message: `Usuario ${usuario_id} no existe` });
      row.usuario_id = usuario_id;
    }

    if (rol_id !== undefined) {
      const r = await Rol.findByPk(rol_id);
      if (!r) return res.status(404).json({ message: `Rol ${rol_id} no existe` });
      row.rol_id = rol_id;
    }

    await row.save();
    res.json({ message: 'usuario_rol actualizado', data: row });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Referencia inválida al actualizar: verifica usuario_id y rol_id',
        detalle: error.parent?.sqlMessage || error.message
      });
    }
    res.status(500).json({ message: 'Error al actualizar usuario_rol', error: error.message });
  }
};

exports.deleteUsuarioRol = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await UsuarioRol.findByPk(id);
    if (!row) return res.status(404).json({ message: 'Registro usuario_rol no encontrado' });

    await row.destroy();
    res.json({ message: 'usuario_rol eliminado', id });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario_rol', error: error.message });
  }
};
