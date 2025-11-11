const Almacen = require('../models/almacenes.model');

// Modelos relacionados
let Sucursal = null, Compra = null, MovInv = null, Inventario = null;
try { Sucursal   = require('../models/sucursales.model'); }                catch (_) {}
try { Compra     = require('../models/compras.model'); }                   catch (_) {} 
try { MovInv     = require('../models/movimientos_inventario.model'); }   catch (_) {}
try { Inventario = require('../models/inventario.model'); }               catch (_) {}

//Obtiene todo los almacenes
exports.getAlmacenes = async (_req, res) => {
  try {
    const rows = await Almacen.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener almacenes', error: error.message });
  }
};

// Obtiene un almacén por ID
exports.getAlmacenById = async (req, res) => {
  try {
    const row = await Almacen.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Almacén no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener almacén', error: error.message });
  }
};

// Crea un nuevo almacén
exports.createAlmacen = async (req, res) => {
  try {
    const { sucursal_id, nombre, activo } = req.body;
    // Validaciones
    if (!sucursal_id || !nombre) {
      return res.status(400).json({ message: 'Sucursal_id y nombre son requeridos' });
    }
    // Verifica si la sucursal existe
    if (Sucursal) {
      const suc = await Sucursal.findByPk(sucursal_id);
      if (!suc) return res.status(404).json({ message: `Sucursal ${sucursal_id} no existe` });
    }

    // Verifica duplicados
    const dup = await Almacen.findOne({ where: { sucursal_id, nombre } });
    if (dup) return res.status(409).json({ message: `El almacén "${nombre}" ya existe en la sucursal ${sucursal_id}` });
    // Crear almacén 
    const row = await Almacen.create({ sucursal_id, nombre, activo });
    res.status(201).json({ message: 'Almacén creado correctamente', data: row });
  } catch (error) {
    // Manejo de error para índice único
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El almacén ya existe (índice único)' });
    }
    res.status(500).json({ message: 'Error al crear almacén', error: error.message });
  }
};

// Actualiza un almacén existente
exports.updateAlmacen = async (req, res) => {
  try {
    const row = await Almacen.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Almacén no encontrado' });

    const { sucursal_id, nombre, activo } = req.body;

    if (sucursal_id !== undefined && Sucursal) {
      const suc = await Sucursal.findByPk(sucursal_id);
      if (!suc) return res.status(404).json({ message: `Sucursal ${sucursal_id} no existe` });
      row.sucursal_id = sucursal_id;
    }

    if (nombre !== undefined) {
      const dup = await Almacen.findOne({ where: { sucursal_id: row.sucursal_id, nombre } });
      if (dup && dup.id !== row.id) {
        return res.status(409).json({ message: `El almacén "${nombre}" ya existe en la sucursal ${row.sucursal_id}` });
      }
      row.nombre = nombre;
    }

    if (activo !== undefined) row.activo = activo;

    await row.save();
    res.json({ message: 'Almacén actualizado correctamente', data: row });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar almacén', error: error.message });
  }
};

// Elimina un almacén
exports.deleteAlmacen = async (req, res) => {
  try {
    const row = await Almacen.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Almacén no encontrado' });

    // Validar relaciones para evitar borrado si hay dependencias
    if (Compra) {
      const n = await Compra.count({ where: { almacen_id: row.id } });
      if (n > 0) return res.status(409).json({ message: `No se puede eliminar: hay ${n} compra(s) registradas en este almacén` });
    }
    if (MovInv) {
      const m = await MovInv.count({ where: { almacen_id: row.id } });
      if (m > 0) return res.status(409).json({ message: `No se puede eliminar: hay ${m} movimiento(s) de inventario` });
    }
    if (Inventario) {
      const i = await Inventario.count({ where: { almacen_id: row.id } });
      if (i > 0) return res.status(409).json({ message: `No se puede eliminar: existen ${i} registro(s) en inventario` });
    }
    const nombre = row.nombre;
    await row.destroy();
    const restantes = await Almacen.count({ where: { sucursal_id: row.sucursal_id } });

    res.json({ message: `Almacén "${nombre}" eliminado correctamente`, almacenes_restantes_en_sucursal: restantes });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar almacén', error: error.message });
  }
};
