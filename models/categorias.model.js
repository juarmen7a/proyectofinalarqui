// models/categorias.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Definición del modelo Categoria, para gestionar las categorías de productos
const Categoria = db.define('categorias', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false }
}, {
  tableName: 'categorias',
  timestamps: false,
  //Indice único para evitar duplicados por empresa_id y nombre
  indexes: [{ unique: true, fields: ['empresa_id', 'nombre'] }]
});

module.exports = Categoria;
