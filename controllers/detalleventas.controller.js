'use strict';

const DetalleVenta = require('../models/detalleventas.model');
const Venta = require('../models/ventas.model');
let Producto = null;
try { Producto = require('../models/productos.model'); } catch {}

exports.getDetalleVentas = async (_req, res) => {
  try {
    const rows = await DetalleVenta.findAll();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalles de venta.', error: error.message });
  }
};

exports.getDetalleVentaById = async (req, res) => {
  try {
    const row = await DetalleVenta.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Detalle de venta no encontrado.' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalle de venta.', error: error.message });
  }
};

exports.getDetallesByVenta = async (req, res) => {
  try {
    const venta_id = req.params.venta_id;
    const items = await DetalleVenta.findAll({ where: { venta_id } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalles por venta.', error: error.message });
  }
};

exports.createDetalleVenta = async (req, res) => {
  try {
    const { venta_id, producto_id, cantidad, precio_unitario, estilo_coccion } = req.body;

    if (!venta_id || !producto_id || cantidad == null || precio_unitario == null) {
      return res.status(400).json({ message: 'venta_id, producto_id, cantidad y precio_unitario son requeridos.' });
    }

    const venta = await Venta.findByPk(venta_id);
    if (!venta) return res.status(404).json({ message: `La venta ${venta_id} no existe.` });

    if (Producto) {
      const producto = await Producto.findByPk(producto_id);
      if (!producto) return res.status(404).json({ message: `El producto ${producto_id} no existe.` });
    }

    const nuevo = await DetalleVenta.create({
      venta_id,
      producto_id,
      cantidad,
      precio_unitario,
      estilo_coccion
    });

    await nuevo.reload();
    res.status(201).json({ message: 'Detalle de venta creado correctamente.', data: nuevo });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear detalle de venta.', error: error.message });
  }
};

exports.updateDetalleVenta = async (req, res) => {
  try {
    const row = await DetalleVenta.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Detalle de venta no encontrado.' });

    const { producto_id, cantidad, precio_unitario, estilo_coccion } = req.body;

    if (producto_id !== undefined && Producto) {
      const producto = await Producto.findByPk(producto_id);
      if (!producto) return res.status(404).json({ message: `El producto ${producto_id} no existe.` });
      row.producto_id = producto_id;
    }

    if (cantidad !== undefined) row.cantidad = cantidad;
    if (precio_unitario !== undefined) row.precio_unitario = precio_unitario;
    if (estilo_coccion !== undefined) row.estilo_coccion = estilo_coccion;

    await row.save();
    await row.reload();

    res.json({ message: 'Detalle de venta actualizado correctamente.', data: row });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar detalle de venta.', error: error.message });
  }
};

exports.deleteDetalleVenta = async (req, res) => {
  try {
    const row = await DetalleVenta.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Detalle de venta no encontrado.' });
    await row.destroy();
    const restantes = await DetalleVenta.count();
    res.json({ message: 'Detalle de venta eliminado correctamente.', detalles_restantes: restantes });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar detalle de venta.', error: error.message });
  }
};
