'use strict';

const { DataTypes } = require('sequelize');
const db = require('../db/db');

/**
 * Clave lógica: (almacen_id, producto_id) única.
 */
const Inventario = db.define('inventario', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  almacen_id:   { type: DataTypes.INTEGER, allowNull: false },
  producto_id:  { type: DataTypes.INTEGER, allowNull: false },
  cantidad:     { type: DataTypes.DECIMAL(18,4), allowNull: false, defaultValue: 0 }
}, {
  tableName: 'inventario',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['almacen_id', 'producto_id'] }
  ]
});

module.exports = Inventario;
