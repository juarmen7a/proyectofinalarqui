'use strict';
const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Venta = db.define('ventas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sucursal_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cajero_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'REGISTRADO'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  numero_orden: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'ventas',
  timestamps: false
});

module.exports = Venta;
