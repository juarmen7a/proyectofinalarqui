'use strict';

const Unidad = require('../models/unidades.model');
const Producto = require('../models/productos.model');

exports.getUnidades = async (req, res) => {
  try {
    const unidades = await Unidad.findAll();
    res.json(unidades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener unidades', error: error.message });
  }
};

exports.getUnidadById = async (req, res) => {
  try {
    const unidad = await Unidad.findByPk(req.params.id);
    if (!unidad) return res.status(404).json({ message: 'Unidad no encontrada' });
    res.json(unidad);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener unidad', error: error.message });
  }
};

exports.createUnidad = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;
    if (!codigo || !nombre) {
      return res.status(400).json({ message: 'Campos "codigo" y "nombre" son requeridos' });
    }

    const existente = await Unidad.findOne({ where: { codigo } });
    if (existente) {
      return res.status(409).json({ message: `La unidad con código "${codigo}" ya existe` });
    }

    const nueva = await Unidad.create({ codigo, nombre });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear unidad', error: error.message });
  }
};

exports.updateUnidad = async (req, res) => {
  try {
    const { id } = req.params;
    const unidad = await Unidad.findByPk(id);
    if (!unidad) return res.status(404).json({ message: 'Unidad no encontrada' });

    const { codigo, nombre } = req.body;
    if (codigo) unidad.codigo = codigo;
    if (nombre) unidad.nombre = nombre;

    await unidad.save();
    res.json({ message: 'Unidad actualizada correctamente', data: unidad });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar unidad', error: error.message });
  }
};

exports.deleteUnidad = async (req, res) => {
  try {
    const { id } = req.params;
    const unidad = await Unidad.findByPk(id);
    if (!unidad) return res.status(404).json({ message: 'Unidad no encontrada' });

    // Bloquear si hay productos usando la unidad
    const usados = await Producto.count({ where: { unidad_id: id } });
    if (usados > 0) {
      return res.status(409).json({
        message: `No se puede eliminar la unidad "${unidad.nombre}" porque está asignada a ${usados} producto(s).`
      });
    }

    await unidad.destroy();
    const restantes = await Unidad.count();
    res.json({
      message: `Unidad "${unidad.nombre}" eliminada correctamente.`,
      unidades_restantes: restantes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar unidad', error: error.message });
  }
};
