const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Usuario = db.define('Usuario', {
  sucursal_id: {
    type: DataTypes.BIGINT
  },
  nombre_completo: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(120),
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(255),
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
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
