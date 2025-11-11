//sucursales.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Definición del modelo Sucursal, para gestionar las sucursales de una empresa
const Sucursal = db.define('Sucursal', {
  empresa_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(20),
    unique: true
  }
}, {
  tableName: 'sucursales',
  timestamps: false
});

module.exports = Sucursal;
