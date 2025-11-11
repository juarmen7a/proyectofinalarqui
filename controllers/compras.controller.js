// Controlador para el modelo Compras
const Compra = require('../models/compras.model');

// Modelos relacionados 
let Almacen = null, Producto = null, Usuario = null, Proveedor = null;
try { Almacen   = require('../models/almacenes.model'); }  catch (_) {}
try { Producto  = require('../models/productos.model'); }  catch (_) {}
try { Usuario   = require('../models/usuarios.model'); }   catch (_) {}
try { Proveedor = require('../models/proveedores.model'); } catch (_) {}

// Busca todas las compras
exports.getCompras = async (_req, res) => {
  try {
    const rows = await Compra.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener compras', error: error.message });
  }
};

// Busca una compra por ID
exports.getCompraById = async (req, res) => {
  try {
    const row = await Compra.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener compra', error: error.message });
  }
};

// Crea una nueva compra
exports.createCompra = async (req, res) => {
  try {
    // Extraer y validar campos obligatorios
    const {
      almacen_id, producto_id, usuario_id, proveedor_id,
      documento_tipo, documento_numero,
      fecha, cantidad, precio_unitario,
      impuesto = 0, estado = 'REGISTRADO'
    } = req.body;
    // Validaciones
    if (!almacen_id || !producto_id || !usuario_id || !proveedor_id ||
        !documento_tipo || !documento_numero || !fecha ||
        cantidad == null || precio_unitario == null) {
      return res.status(400).json({
        message: 'almacen_id, producto_id, usuario_id, proveedor_id, documento_tipo, documento_numero, fecha, cantidad y precio_unitario son requeridos'
      });
    }
    // Verificar existencia de claves foráneas
    if (Almacen)   { const a = await Almacen.findByPk(almacen_id);   if (!a) return res.status(404).json({ message: `Almacén ${almacen_id} no existe` }); }
    if (Producto)  { const p = await Producto.findByPk(producto_id); if (!p) return res.status(404).json({ message: `Producto ${producto_id} no existe` }); }
    if (Usuario)   { const u = await Usuario.findByPk(usuario_id);   if (!u) return res.status(404).json({ message: `Usuario ${usuario_id} no existe` }); }
    if (Proveedor) { const pr= await Proveedor.findByPk(proveedor_id);if (!pr) return res.status(404).json({ message: `Proveedor ${proveedor_id} no existe` }); }
    
    // Verificar duplicado 
    const dup = await Compra.findOne({ where: { proveedor_id, documento_tipo, documento_numero } });
    if (dup) {
      return res.status(409).json({
        message: `Ya existe una compra con ${documento_tipo} "${documento_numero}" para el proveedor ${proveedor_id}`
      });
    }

    // Crear compra
    const row = await Compra.create({
      almacen_id, producto_id, usuario_id, proveedor_id,
      documento_tipo, documento_numero,
      fecha, cantidad, precio_unitario,
      impuesto, estado
    });

    res.status(201).json({ message: 'Compra creada correctamente', data: row });
  } catch (error) {
    // Manejo de error para índice único
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Compra duplicada (documento ya registrado)' });
    }
    res.status(500).json({ message: 'Error al crear compra', error: error.message });
  }
};

// Actualiza una compra existente
exports.updateCompra = async (req, res) => {
  try {
    const row = await Compra.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Compra no encontrada' });

    const {
      almacen_id, producto_id, usuario_id, proveedor_id,
      documento_tipo, documento_numero,
      fecha, cantidad, precio_unitario, impuesto, estado
    } = req.body;

    if (almacen_id !== undefined && Almacen) {
      const a = await Almacen.findByPk(almacen_id); if (!a) return res.status(404).json({ message: `Almacén ${almacen_id} no existe` });
      row.almacen_id = almacen_id;
    }
    if (producto_id !== undefined && Producto) {
      const p = await Producto.findByPk(producto_id); if (!p) return res.status(404).json({ message: `Producto ${producto_id} no existe` });
      row.producto_id = producto_id;
    }
    if (usuario_id !== undefined && Usuario) {
      const u = await Usuario.findByPk(usuario_id); if (!u) return res.status(404).json({ message: `Usuario ${usuario_id} no existe` });
      row.usuario_id = usuario_id;
    }
    if (proveedor_id !== undefined && Proveedor) {
      const pr = await Proveedor.findByPk(proveedor_id); if (!pr) return res.status(404).json({ message: `Proveedor ${proveedor_id} no existe` });
      row.proveedor_id = proveedor_id;
    }

    if (documento_tipo !== undefined)   row.documento_tipo   = documento_tipo;
    if (documento_numero !== undefined) row.documento_numero = documento_numero;
    if (fecha !== undefined)            row.fecha            = fecha;
    if (cantidad !== undefined)         row.cantidad         = cantidad;
    if (precio_unitario !== undefined)  row.precio_unitario  = precio_unitario;
    if (impuesto !== undefined)         row.impuesto         = impuesto;
    if (estado !== undefined)           row.estado           = estado;

  // Verificar duplicado
    const chk = await Compra.findOne({
      where: {
        proveedor_id: row.proveedor_id,
        documento_tipo: row.documento_tipo,
        documento_numero: row.documento_numero
      }
    });
    if (chk && chk.id !== row.id) {
      return res.status(409).json({
        message: `Ya existe una compra con ${row.documento_tipo} "${row.documento_numero}" para el proveedor ${row.proveedor_id}`
      });
    }

    await row.save();
    res.json({ message: 'Compra actualizada correctamente', data: row });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar compra', error: error.message });
  }
};

// Elimina una compra
exports.deleteCompra = async (req, res) => {
  try {
    const row = await Compra.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Compra no encontrada' });

    const ref = `${row.documento_tipo} ${row.documento_numero}`;
    await row.destroy();
    const restantes = await Compra.count();

    res.json({ message: `Compra "${ref}" eliminada correctamente`, compras_restantes: restantes });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar compra', error: error.message });
  }
};
