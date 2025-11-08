'use strict';

const Venta = require('../models/ventas.model');
const DetalleVenta = require('../models/detalleventas.model'); // <- tu nombre de archivo para detalle
let Sucursal = null, Usuario = null;
try { Sucursal = require('../models/sucursales.model'); } catch {}
try { Usuario  = require('../models/usuarios.model'); }  catch {}

const ESTADOS_PERMITIDOS = ['1', '2', '3']; // 1=Registrado, 2=Procesado, 3=Cerrado

// ------------------- GET /ventas -------------------
exports.getVentas = async (_req, res) => {
  try {
    const ventas = await Venta.findAll();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas.', error: error.message });
  }
};

// ------------------- GET /ventas/:id -------------------
exports.getVentaById = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada.' });

    const detalles = await DetalleVenta.findAll({ where: { venta_id: venta.id } });
    res.json({ ...venta.toJSON(), detalles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener venta.', error: error.message });
  }
};

// ------------------- POST /ventas -------------------
exports.createVenta = async (req, res) => {
  try {
    const { sucursal_id, cajero_id, estado = '1', fecha, numero_orden } = req.body;

    // Requeridos
    if (!sucursal_id || !cajero_id || !fecha || !numero_orden) {
      return res.status(400).json({
        message: 'sucursal_id, cajero_id, fecha y numero_orden son requeridos.'
      });
    }

    // Validar estado permitido
    if (!ESTADOS_PERMITIDOS.includes(String(estado))) {
      return res.status(400).json({
        message: `El tipo de estado "${estado}" no es válido.`,
        detalle: 'Solo se permiten: 1 (Registrado), 2 (Procesado), 3 (Cerrado).'
      });
    }

    // Validar FKs si los modelos están disponibles
    if (Sucursal) {
      const s = await Sucursal.findByPk(sucursal_id);
      if (!s) return res.status(404).json({ message: `Sucursal ${sucursal_id} no existe.` });
    }
    if (Usuario) {
      const u = await Usuario.findByPk(cajero_id);
      if (!u) return res.status(404).json({ message: `Cajero ${cajero_id} no existe.` });
    }

    // Duplicado por número de orden
    const duplicado = await Venta.findOne({ where: { numero_orden } });
    if (duplicado) {
      return res.status(409).json({ message: `Ya existe una venta con número de orden "${numero_orden}".` });
    }

    const nuevaVenta = await Venta.create({
      sucursal_id, cajero_id, estado, fecha, numero_orden
    });

    res.status(201).json({ message: 'Venta creada correctamente.', data: nuevaVenta });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear venta.', error: error.message });
  }
};

// ------------------- PUT /ventas/:id -------------------
exports.updateVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada.' });

    const { sucursal_id, cajero_id, estado, fecha, numero_orden } = req.body;

    // Validar estado cuando venga en el body
    if (estado !== undefined && !ESTADOS_PERMITIDOS.includes(String(estado))) {
      return res.status(400).json({
        message: `El tipo de estado "${estado}" no es válido.`,
        detalle: 'Solo se permiten: 1 (Registrado), 2 (Procesado), 3 (Cerrado).'
      });
    }

    // Validar FKs si cambian
    if (sucursal_id !== undefined && Sucursal) {
      const s = await Sucursal.findByPk(sucursal_id);
      if (!s) return res.status(404).json({ message: `Sucursal ${sucursal_id} no existe.` });
      venta.sucursal_id = sucursal_id;
    }

    if (cajero_id !== undefined && Usuario) {
      const u = await Usuario.findByPk(cajero_id);
      if (!u) return res.status(404).json({ message: `Cajero ${cajero_id} no existe.` });
      venta.cajero_id = cajero_id;
    }

    if (estado !== undefined) venta.estado = estado;
    if (fecha !== undefined) venta.fecha = fecha;
    if (numero_orden !== undefined) venta.numero_orden = numero_orden;

    // Evitar duplicado por numero_orden
    if (venta.numero_orden) {
      const existe = await Venta.findOne({ where: { numero_orden: venta.numero_orden } });
      if (existe && existe.id !== venta.id) {
        return res.status(409).json({ message: `Ya existe la venta con número de orden "${venta.numero_orden}".` });
      }
    }

    await venta.save();
    res.json({ message: 'Venta actualizada correctamente.', data: venta });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar venta.', error: error.message });
  }
};

// ------------------- DELETE /ventas/:id -------------------
exports.deleteVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada.' });

    // Borrar detalles primero
    await DetalleVenta.destroy({ where: { venta_id: venta.id } });
    await venta.destroy();

    const restantes = await Venta.count();
    res.json({ message: 'Venta eliminada correctamente.', ventas_restantes: restantes });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar venta.', error: error.message });
  }
};
