const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Categoria = db.define('categorias', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false }
}, {
  tableName: 'categorias',
  timestamps: false,
  // Única por empresa
  indexes: [{ unique: true, fields: ['empresa_id', 'nombre'] }]
});

module.exports = Categoria;
