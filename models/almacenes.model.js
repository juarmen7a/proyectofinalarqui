// models/almacenes.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Definición del modelo Almacen, para gestionar los almacenes de una sucursal
const Almacen = db.define('almacenes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'almacenes',
  timestamps: false,
  indexes: [
  // Índice único para evitar duplicados por sucursal_id y nombre
    { unique: true, fields: ['sucursal_id', 'nombre'] }
  ]
});

module.exports = Almacen;
