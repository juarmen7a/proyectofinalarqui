// controllers/sucursales.controller.js
const Sucursal = require('../models/sucursales.model');
const Usuario  = require('../models/usuarios.model'); 

// Obtiene todas las sucursales
exports.getSucursales = async (req, res) => {
  try {
    const rows = await Sucursal.findAll();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener sucursales' });
  }
};

// Obtiene una sucursal por ID
exports.getSucursalById = async (req, res) => {
  try {
    const row = await Sucursal.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Sucursal no encontrada' });
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener sucursal' });
  }
};

// Crea una nueva sucursal
exports.createSucursal = async (req, res) => {
  try {
    const { empresa_id, nombre, codigo } = req.body;
    const row = await Sucursal.create({ empresa_id, nombre, codigo });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error, message:'Error al crear sucursal' });
  }
};

  // Actualiza una sucursal existente
exports.updateSucursal = async (req, res) => {
  try {
    const row = await Sucursal.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Sucursal no encontrada' });
    const { empresa_id, nombre, codigo } = req.body;
    row.empresa_id = empresa_id ?? row.empresa_id;
    row.nombre = nombre ?? row.nombre;
    row.codigo = codigo ?? row.codigo;
    await row.save();
    res.json(row);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al actualizar sucursal' });
  }
};

// Elimina una sucursal
exports.deleteSucursal = async (req, res) => {
  try {
    const id = req.params.id;

    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }

    // Verifica usuarios asignados antes de eliminar
    const usuariosAsignados = await Usuario.count({ where: { sucursal_id: id } });

    if (usuariosAsignados > 0) {
      return res.status(409).json({
        message: `No puedes borrar la sucursal "${sucursal.nombre}" porque tiene usuarios asignados`,
        detalle: `Usuarios vinculados: ${usuariosAsignados}`
      });
    }
    const nombreSucursal = sucursal.nombre;

    //Borra la sucursal
    await sucursal.destroy();
    return res.status(200).json({
      message: `Sucursal "${nombreSucursal}" eliminada correctamente`
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar sucursal', error });
  }
};
