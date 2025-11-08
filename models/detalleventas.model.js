'use strict';

const { DataTypes } = require('sequelize');
const db = require('../db/db');

const DetalleVenta = db.define('DetalleVenta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true // lo calcula la BD
  },
  estilo_coccion: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'detalle_ventas',
  timestamps: false
});

module.exports = DetalleVenta;
