'use strict';

const { DataTypes } = require('sequelize');
const db = require('../db/db');

/**
 * Tabla física: compra_producto (según tu esquema)
 * subtotal y total son columnas GENERADAS en la BD → no se envían desde la app
 */
const Compra = db.define('compras', {
  id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  almacen_id:       { type: DataTypes.INTEGER, allowNull: false },
  producto_id:      { type: DataTypes.INTEGER, allowNull: false },
  usuario_id:       { type: DataTypes.INTEGER, allowNull: false },
  proveedor_id:     { type: DataTypes.INTEGER, allowNull: false },
  documento_tipo:   { type: DataTypes.STRING(30), allowNull: false },
  documento_numero: { type: DataTypes.STRING(60), allowNull: false },
  fecha:            { type: DataTypes.DATEONLY, allowNull: false },
  cantidad:         { type: DataTypes.DECIMAL(18,4), allowNull: false },
  precio_unitario:  { type: DataTypes.DECIMAL(18,4), allowNull: false },

  // Marcamos allowNull: true para que Sequelize no valide not-null en app;
  // MySQL las calcula y las devuelve.
  subtotal: { type: DataTypes.DECIMAL(18,2), allowNull: true },
  impuesto: { type: DataTypes.DECIMAL(18,2), allowNull: false, defaultValue: 0 },
  total:    { type: DataTypes.DECIMAL(18,2), allowNull: true },

  estado:   { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'REGISTRADO' }
}, {
  tableName: 'compra_producto',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['proveedor_id', 'documento_tipo', 'documento_numero'] }
  ]
});

module.exports = Compra;
