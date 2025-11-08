'use strict';

const Proveedor = require('../models/proveedores.model');

// Validaciones opcionales de FK/uso (no fallan si el modelo no existe)
let Empresa = null, CompraProducto = null;
try { Empresa = require('../models/empresas.model'); } catch (_) {}
try { CompraProducto = require('../models/compra_producto.model'); } catch (_) {}

exports.getProveedores = async (_req, res) => {
  try {
    const rows = await Proveedor.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
  }
};

exports.getProveedorById = async (req, res) => {
  try {
    const row = await Proveedor.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedor', error: error.message });
  }
};

exports.createProveedor = async (req, res) => {
  try {
    const { empresa_id, nombre, nit, telefono, correo, direccion, activo } = req.body;

    if (!empresa_id || !nombre || !nit) {
      return res.status(400).json({ message: 'empresa_id, nombre y nit son requeridos' });
    }

    if (Empresa) {
      const emp = await Empresa.findByPk(empresa_id);
      if (!emp) return res.status(404).json({ message: `Empresa ${empresa_id} no existe` });
    }

    // existentes
    const dupNombre = await Proveedor.findOne({ where: { nombre } });
    if (dupNombre) return res.status(409).json({ message: `El proveedor "${nombre}" ya existe` });

    const dupNit = await Proveedor.findOne({ where: { nit } });
    if (dupNit) return res.status(409).json({ message: `El NIT "${nit}" ya está registrado` });

    const row = await Proveedor.create({ empresa_id, nombre, nit, telefono, correo, direccion, activo });

    res.status(201).json({ message: 'Proveedor creado correctamente', data: row });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Proveedor ya existe (índice único)', detalle: error.errors?.[0]?.message });
    }
    res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
  }
};

exports.updateProveedor = async (req, res) => {
  try {
    const row = await Proveedor.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Proveedor no encontrado' });

    const { empresa_id, nombre, nit, telefono, correo, direccion, activo } = req.body;

    if (empresa_id !== undefined && Empresa) {
      const emp = await Empresa.findByPk(empresa_id);
      if (!emp) return res.status(404).json({ message: `Empresa ${empresa_id} no existe` });
      row.empresa_id = empresa_id;
    }

    if (nombre !== undefined && nombre !== row.nombre) {
      const dup = await Proveedor.findOne({ where: { nombre } });
      if (dup) return res.status(409).json({ message: `El proveedor "${nombre}" ya existe` });
      row.nombre = nombre;
    }

    if (nit !== undefined && nit !== row.nit) {
      const dupN = await Proveedor.findOne({ where: { nit } });
      if (dupN) return res.status(409).json({ message: `El NIT "${nit}" ya está registrado` });
      row.nit = nit;
    }

    if (telefono  !== undefined) row.telefono  = telefono;
    if (correo    !== undefined) row.correo    = correo;
    if (direccion !== undefined) row.direccion = direccion;
    if (activo    !== undefined) row.activo    = activo;

    await row.save();
    res.json({ message: 'Proveedor actualizado correctamente', data: row });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
  }
};

exports.deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Proveedor.findByPk(id);
    if (!row) return res.status(404).json({ message: 'Proveedor no encontrado' });

    // Bloquear borrado si está referenciado en compras
    if (CompraProducto) {
      const ref = await CompraProducto.count({ where: { proveedor_id: id } });
      if (ref > 0) {
        return res.status(409).json({ message: `No se puede eliminar: proveedor usado en ${ref} compra(s)` });
      }
    }

    const nombre = row.nombre;
    await row.destroy();
    const restantes = await Proveedor.count();

    res.json({ message: `Proveedor "${nombre}" eliminado correctamente`, proveedores_restantes: restantes });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message });
  }
};
