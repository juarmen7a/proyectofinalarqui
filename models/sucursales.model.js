const { DataTypes } = require('sequelize');
const db = require('../db/db');

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
