// controllers/empresas.controller.js
const Empresas = require('../models/empresas.model');
const Sucursales = require('../models/sucursales.model'); 

//
exports.getEmpresas = async (_req, res) => {
  try { res.status(200).json(await Empresas.findAll()); }
  catch (error) { res.status(500).json({ error, message: 'Error al obtener empresas' }); }
};

// Busca una empresa por ID
exports.getEmpresaById = async (req, res) => {
  try {
    const row = await Empresas.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.status(200).json(row);
  } catch (error) { res.status(500).json({ error, message: 'Error al obtener la empresa' }); }
};

// Crea una nueva empresa
exports.createEmpresa = async (req, res) => {
  try { res.status(201).json(await Empresas.create(req.body)); }
  catch (error) { res.status(500).json({ error, message: 'Error al crear la empresa' }); }
};

// Actualiza una empresa existente
exports.updateEmpresa = async (req, res) => {
  try {
    const row = await Empresas.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Empresa no encontrada' });
    Object.assign(row, req.body);
    await row.save();
    res.status(200).json(row);
  } catch (error) { res.status(500).json({ error, message: 'Error al actualizar la empresa' }); }
};

// Actualiza una empresa existente parcialmente
exports.patchEmpresa = async (req, res) => {
  try {
    const row = await Empresas.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Empresa no encontrada' });
    await row.update(req.body);
    res.status(200).json(row);
  } catch (error) { res.status(500).json({ error, message: 'Error al actualizar parcialmente la empresa' }); }
};

// Elimina una empresa
exports.deleteEmpresa = async (req, res) => {
  try {
    const id = req.params.id;

    const empresa = await Empresas.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Verifica si hay sucursales vinculadas
    const sucursalesVinculadas = await Sucursales.count({ where: { empresa_id: id } });
    if (sucursalesVinculadas > 0) {
      return res.status(409).json({
        message: `No puedes borrar la empresa "${empresa.nombre}" porque tiene sucursales asignadas`,
        detalle: `Sucursales vinculadas: ${sucursalesVinculadas}`
      });
    }

    // Procede a eliminar la empresa
    const nombre = empresa.nombre;
    await empresa.destroy();

    const activas = await Empresas.count({ where: { activo: true } });
    return res.status(200).json({
      message: `Empresa "${nombre}" Eliminada correctamente`,
      empresas_activas_restantes: activas
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar empresa', error });
  }
};

