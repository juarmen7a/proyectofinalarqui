'use strict';

const Inventario = require('../models/inventario.model');
const Almacen = require('../models/almacenes.model');
const Producto = require('../models/productos.model');

// ------------------- OBTENER TODOS -------------------
exports.getInventarios = async (req, res) => {
  try {
    const inventarios = await Inventario.findAll();
    if (inventarios.length === 0) {
      return res.status(404).json({ message: 'No hay registros en inventario.' });
    }
    res.status(200).json(inventarios);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener inventario.',
      error: error.message
    });
  }
};

// ------------------- OBTENER POR ID -------------------
exports.getInventarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ message: `No existe inventario con ID ${id}.` });
    }
    res.status(200).json(inventario);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener inventario por ID.',
      error: error.message
    });
  }
};

// ------------------- CREAR INVENTARIO -------------------
exports.createInventario = async (req, res) => {
  try {
    const { almacen_id, producto_id, cantidad = 0 } = req.body;

    if (!almacen_id || !producto_id) {
      return res.status(400).json({
        message: 'almacen_id y producto_id son requeridos.'
      });
    }

    if (cantidad < 0) {
      return res.status(400).json({
        message: 'La cantidad no puede ser negativa.'
      });
    }

    // Validar existencia del almacén
    const almacen = await Almacen.findByPk(almacen_id);
    if (!almacen) {
      return res.status(404).json({
        message: `El almacén con ID ${almacen_id} no existe.`
      });
    }

    // Validar existencia del producto
    const producto = await Producto.findByPk(producto_id);
    if (!producto) {
      return res.status(404).json({
        message: `El producto con ID ${producto_id} no existe.`
      });
    }

    // Verificar duplicado
    const existente = await Inventario.findOne({
      where: { almacen_id, producto_id }
    });

    if (existente) {
      return res.status(409).json({
        message: `Ya existe un inventario para el producto ${producto_id} en el almacén ${almacen_id}.`
      });
    }

    const nuevoInventario = await Inventario.create({
      almacen_id,
      producto_id,
      cantidad
    });

    res.status(201).json({
      message: 'Inventario creado correctamente.',
      data: nuevoInventario
    });

  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(404).json({
        message: 'El producto o el almacén no existen (violación de clave foránea).',
        error: error.parent?.sqlMessage
      });
    }

    res.status(500).json({
      message: 'Error al crear inventario.',
      error: error.message
    });
  }
};

// ------------------- ACTUALIZAR INVENTARIO -------------------
exports.updateInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ message: `No existe inventario con ID ${id}.` });
    }

    if (cantidad < 0) {
      return res.status(400).json({ message: 'La cantidad no puede ser negativa.' });
    }

    await inventario.update({ cantidad });
    res.status(200).json({ message: 'Inventario actualizado correctamente.', data: inventario });

  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar inventario.',
      error: error.message
    });
  }
};

// ------------------- ELIMINAR INVENTARIO -------------------
exports.deleteInventario = async (req, res) => {
  try {
    const { id } = req.params;

    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ message: `No existe inventario con ID ${id}.` });
    }

    await inventario.destroy();
    res.status(200).json({ message: 'Inventario eliminado correctamente.' });

  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar inventario.',
      error: error.message
    });
  }
};
