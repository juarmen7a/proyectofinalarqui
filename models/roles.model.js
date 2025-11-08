const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Rol = db.define('Rol', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;
