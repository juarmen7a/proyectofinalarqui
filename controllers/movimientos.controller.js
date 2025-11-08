'use strict';

const Movimiento = require('../models/movimientos.model');

// Modelos opcionales para validar FKs y ajustar stock
let Almacen = null, Producto = null, Inventario = null;
try { Almacen   = require('../models/almacenes.model'); }  catch (_) {}
try { Producto  = require('../models/productos.model'); }   catch (_) {}
try { Inventario= require('../models/inventario.model'); }  catch (_) {}

// 1=ENTRADA, 2=SALIDA. Acepta texto también.
function parseTipo(v) {
  if (typeof v === 'number') return v;
  const map = { 'ENTRADA': 1, 'SALIDA': 2 };
  return map[String(v).toUpperCase()] ?? 1;
}
function signedQty(tipo, cantidad) {
  return (tipo === 2 ? -1 : 1) * (+cantidad);
}

async function getStock(almacen_id, producto_id) {
  if (!Inventario) return null; // no controlar stock si no existe el modelo
  const row = await Inventario.findOne({ where: { almacen_id, producto_id } });
  return row ? +row.cantidad : 0;
}

async function addStock(almacen_id, producto_id, delta) {
  if (!Inventario) return; // no hay inventario: salir silencioso
  const row = await Inventario.findOne({ where: { almacen_id, producto_id } });
  if (row) {
    row.cantidad = (+row.cantidad) + (+delta);
    await row.save();
  } else {
    // crear solo si delta positivo
    if (delta < 0) throw new Error('STOCK_INSUFICIENTE_NO_ROW');
    await Inventario.create({ almacen_id, producto_id, cantidad: delta });
  }
}

exports.getMovimientos = async (_req, res) => {
  try {
    const rows = await Movimiento.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
  }
};

exports.getMovimientoById = async (req, res) => {
  try {
    const row = await Movimiento.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimiento', error: error.message });
  }
};

exports.createMovimiento = async (req, res) => {
  try {
    let { almacen_id, producto_id, fecha, tipo, cantidad, referencia, referencia_id } = req.body;

    if (!almacen_id || !producto_id || !fecha || cantidad == null) {
      return res.status(400).json({ message: 'almacen_id, producto_id, fecha y cantidad son requeridos' });
    }
    tipo = parseTipo(tipo ?? 1);

    if (Almacen)  { const a = await Almacen.findByPk(almacen_id);  if (!a) return res.status(404).json({ message: `Almacén ${almacen_id} no existe` }); }
    if (Producto) { const p = await Producto.findByPk(producto_id); if (!p) return res.status(404).json({ message: `Producto ${producto_id} no existe` }); }

    // control de stock para SALIDA
    if (Inventario && tipo === 2) {
      const stock = await getStock(almacen_id, producto_id);
      if (stock < +cantidad) return res.status(409).json({ message: `Stock insuficiente: actual ${stock}, requerido ${cantidad}` });
    }

    // crear movimiento
    const row = await Movimiento.create({ almacen_id, producto_id, fecha, tipo, cantidad, referencia, referencia_id });

    // ajustar inventario
    try {
      await addStock(almacen_id, producto_id, signedQty(tipo, cantidad));
    } catch (e) {
      // rollback lógico si no hay inventario pero ya se creó el movimiento
      await row.destroy();
      if (e.message === 'STOCK_INSUFICIENTE_NO_ROW') {
        return res.status(409).json({ message: 'Stock insuficiente' });
      }
      throw e;
    }

    res.status(201).json({ message: 'Movimiento creado correctamente', data: row });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear movimiento', error: error.message });
  }
};

exports.updateMovimiento = async (req, res) => {
  try {
    const mov = await Movimiento.findByPk(req.params.id);
    if (!mov) return res.status(404).json({ message: 'Movimiento no encontrado' });

    // valores actuales
    const oldKey = { almacen_id: mov.almacen_id, producto_id: mov.producto_id };
    const oldSigned = signedQty(mov.tipo, mov.cantidad);

    // nuevos valores
    let {
      almacen_id = mov.almacen_id,
      producto_id = mov.producto_id,
      fecha = mov.fecha,
      tipo = mov.tipo,
      cantidad = mov.cantidad,
      referencia = mov.referencia,
      referencia_id = mov.referencia_id
    } = req.body;

    tipo = parseTipo(tipo);

    if (Almacen && almacen_id !== mov.almacen_id) {
      const a = await Almacen.findByPk(almacen_id); if (!a) return res.status(404).json({ message: `Almacén ${almacen_id} no existe` });
    }
    if (Producto && producto_id !== mov.producto_id) {
      const p = await Producto.findByPk(producto_id); if (!p) return res.status(404).json({ message: `Producto ${producto_id} no existe` });
    }

    // calcular delta total (quitar lo viejo y aplicar lo nuevo)
    const newSigned = signedQty(tipo, cantidad);
    const revertOld = -oldSigned;

    // 1) revertir movimiento anterior en su clave vieja
    if (Inventario) {
      await addStock(oldKey.almacen_id, oldKey.producto_id, revertOld);
      // 2) aplicar nuevo sobre la clave nueva (puede ser diferente)
      if (tipo === 2) {
        const stock = await getStock(almacen_id, producto_id);
        if (stock < +cantidad) {
          // deshacer revertOld
          await addStock(oldKey.almacen_id, oldKey.producto_id, -revertOld);
          return res.status(409).json({ message: `Stock insuficiente: actual ${stock}, requerido ${cantidad}` });
        }
      }
      await addStock(almacen_id, producto_id, newSigned);
    }

    // guardar cambios del movimiento
    mov.almacen_id = almacen_id;
    mov.producto_id = producto_id;
    mov.fecha = fecha;
    mov.tipo = tipo;
    mov.cantidad = cantidad;
    mov.referencia = referencia;
    mov.referencia_id = referencia_id;

    await mov.save();
    res.json({ message: 'Movimiento actualizado correctamente', data: mov });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar movimiento', error: error.message });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    const mov = await Movimiento.findByPk(req.params.id);
    if (!mov) return res.status(404).json({ message: 'Movimiento no encontrado' });

    // revertir su efecto en inventario
    if (Inventario) {
      await addStock(mov.almacen_id, mov.producto_id, -signedQty(mov.tipo, mov.cantidad));
    }

    await mov.destroy();
    const restantes = await Movimiento.count();
    res.json({ message: 'Movimiento eliminado correctamente', movimientos_restantes: restantes });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar movimiento', error: error.message });
  }
};
