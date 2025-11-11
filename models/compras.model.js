// models/compras.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Definición del modelo Compra, para registrar las compras de productos
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

 // Campos calculados, pueden ser nulos al inicio
  subtotal: { type: DataTypes.DECIMAL(18,2), allowNull: true },
  impuesto: { type: DataTypes.DECIMAL(18,2), allowNull: false, defaultValue: 0 },
  total:    { type: DataTypes.DECIMAL(18,2), allowNull: true },

  estado:   { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'REGISTRADO' }
}, {
  tableName: 'compra_producto',
  timestamps: false,
  // Índice único para evitar duplicados por proveedor y documento
  indexes: [
    { unique: true, fields: ['proveedor_id', 'documento_tipo', 'documento_numero'] }
  ]
});

module.exports = Compra;
