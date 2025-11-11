//sucursales.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db'); 

// Definición del modelo Unidad, para gestionar las unidades de medida
const Unidad = db.define('unidades', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'unidades',
  timestamps: false
});

module.exports = Unidad;
