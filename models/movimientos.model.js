'use strict';

const { DataTypes } = require('sequelize');
const db = require('../db/db');

/**
 * Tabla física: movimientos_inventario
 * tipo: 1 = ENTRADA, 2 = SALIDA
 */
const Movimiento = db.define('movimientos', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  almacen_id:  { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha:       { type: DataTypes.DATEONLY, allowNull: false },
  tipo:        { type: DataTypes.TINYINT, allowNull: false }, // 1=ENTRADA, 2=SALIDA
  cantidad:    { type: DataTypes.DECIMAL(18,4), allowNull: false },
  referencia:  { type: DataTypes.STRING(80) },   // p.ej. 'COMPRA', 'AJUSTE', 'VENTA'
  referencia_id:{ type: DataTypes.INTEGER }      // id de compra/venta/ajuste
}, {
  tableName: 'movimientos_inventario',
  timestamps: false,
  indexes: [
    { fields: ['almacen_id', 'producto_id', 'fecha'] }
  ]
});

module.exports = Movimiento;
