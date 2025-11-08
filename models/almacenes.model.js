'use strict';

const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Almacen = db.define('almacenes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'almacenes',
  timestamps: false,
  indexes: [
    // nombre único por sucursal
    { unique: true, fields: ['sucursal_id', 'nombre'] }
  ]
});

module.exports = Almacen;
