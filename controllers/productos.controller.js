'use strict';

const Producto = require('../models/productos.model');

exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const { empresa_id, categoria_id, unidad_id, tipo, codigo, nombre, descripcion, activo } = req.body;

    if (!empresa_id || !categoria_id || !unidad_id || !tipo || !codigo || !nombre) {
      return res.status(400).json({
        message: 'Los campos empresa_id, categoria_id, unidad_id, tipo, codigo y nombre son obligatorios.'
      });
    }

    // Verifica si el producto ya existe
    const existente = await Producto.findOne({ where: { empresa_id, codigo } });
    if (existente) {
      return res.status(409).json({
        message: `⚠️ El producto con código "${codigo}" ya existe en la empresa ${empresa_id}.`
      });
    }

    const nuevo = await Producto.create({
      empresa_id, categoria_id, unidad_id, tipo, codigo, nombre, descripcion, activo
    });

    res.status(201).json({
      message: '✅ Producto creado exitosamente.',
      data: nuevo
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: '⚠️ Ya existe un producto con ese código.' });
    }
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const { empresa_id, categoria_id, unidad_id, tipo, codigo, nombre, descripcion, activo } = req.body;

    // Evitar código duplicado
    const duplicado = await Producto.findOne({ where: { empresa_id, codigo } });
    if (duplicado && duplicado.id !== producto.id) {
      return res.status(409).json({
        message: `⚠️ Ya existe otro producto con el código "${codigo}" en la empresa ${empresa_id}.`
      });
    }

    await producto.update({
      empresa_id, categoria_id, unidad_id, tipo, codigo, nombre, descripcion, activo
    });

    res.json({ message: '✅ Producto actualizado correctamente.', data: producto });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const nombre = producto.nombre;
    await producto.destroy();
    const restantes = await Producto.count();

    res.json({
      message: `🗑️ Producto "${nombre}" eliminado correctamente.`,
      productos_restantes: restantes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};
