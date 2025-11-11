// models/inventario.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Definición del modelo Inventario
const Inventario = db.define('inventario', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  almacen_id:   { type: DataTypes.INTEGER, allowNull: false },
  producto_id:  { type: DataTypes.INTEGER, allowNull: false },
  cantidad:     { type: DataTypes.DECIMAL(18,4), allowNull: false, defaultValue: 0 }
}, {
  tableName: 'inventario',
  timestamps: false,
  // Índice único para evitar duplicados por almacen_id y producto_id
  indexes: [
    { unique: true, fields: ['almacen_id', 'producto_id'] }
  ]
});

module.exports = Inventario;
