const { DataTypes } = require('sequelize');
const db = require('../db/db');

const UsuarioRol = db.define('usuario_roles', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  rol_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'usuario_roles',
  timestamps: false
});

module.exports = UsuarioRol;
