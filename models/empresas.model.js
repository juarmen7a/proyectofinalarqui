const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Empresa = db.define('Empresa', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'empresas',
  timestamps: false
});

module.exports = Empresa;
