'use strict';

const Categoria = require('../models/categorias.model');
let Empresa = null;
let Producto = null;
try { Empresa = require('../models/empresas.model'); } catch (_) {}
try { Producto = require('../models/productos.model'); } catch (_) {}

exports.getCategorias = async (req, res) => {
  try {
    const rows = await Categoria.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
    const row = await Categoria.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { empresa_id, nombre } = req.body;
    if (!empresa_id || !nombre) {
      return res.status(400).json({ message: 'empresa_id y nombre son requeridos' });
    }

    if (Empresa) {
      const empresa = await Empresa.findByPk(empresa_id);
      if (!empresa) return res.status(404).json({ message: `Empresa ${empresa_id} no existe` });
    }

    const dup = await Categoria.findOne({ where: { empresa_id, nombre } });
    if (dup) return res.status(409).json({ message: `La categoría "${nombre}" ya existe para la empresa ${empresa_id}` });

    const row = await Categoria.create({ empresa_id, nombre });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const row = await Categoria.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Categoría no encontrada' });

    const { empresa_id, nombre } = req.body;

    let newEmpresaId = row.empresa_id;
    let newNombre = row.nombre;

    if (empresa_id !== undefined) {
      if (Empresa) {
        const emp = await Empresa.findByPk(empresa_id);
        if (!emp) return res.status(404).json({ message: `Empresa ${empresa_id} no existe` });
      }
      newEmpresaId = empresa_id;
    }

    if (nombre !== undefined) {
      if (String(nombre).trim() === '') return res.status(400).json({ message: 'El nombre no puede ser vacío' });
      newNombre = nombre;
    }

    // Validar unicidad por empresa
    const dup = await Categoria.findOne({
      where: { empresa_id: newEmpresaId, nombre: newNombre }
    });
    if (dup && dup.id !== row.id) {
      return res.status(409).json({ message: `La categoría "${newNombre}" ya existe para la empresa ${newEmpresaId}` });
    }

    row.empresa_id = newEmpresaId;
    row.nombre = newNombre;
    await row.save();

    res.json({ message: 'Categoría actualizada correctamente', data: row });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Categoria.findByPk(id);
    if (!row) return res.status(404).json({ message: 'Categoría no encontrada' });

    if (Producto) {
      const usados = await Producto.count({ where: { categoria_id: id } });
      if (usados > 0) {
        return res.status(409).json({
          message: `No se puede eliminar la categoría "${row.nombre}" porque está asignada a ${usados} producto(s).`
        });
      }
    }

    const nombre = row.nombre;
    await row.destroy();
    const restantes = await Categoria.count({ where: { empresa_id: row.empresa_id } });

    res.json({
      message: `Categoría "${nombre}" eliminada correctamente.`,
      categorias_restantes_en_empresa: restantes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
};
