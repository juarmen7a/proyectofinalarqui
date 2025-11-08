'use strict';

const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Proveedor = db.define('proveedores', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  empresa_id: { type: DataTypes.INTEGER, allowNull: false },

  nombre: { type: DataTypes.STRING(120), allowNull: false, unique: true },

  nit: { type: DataTypes.STRING(30), allowNull: false, unique: true },

  telefono: { type: DataTypes.STRING(30) },

  correo: { type: DataTypes.STRING(120) },

  direccion: { type: DataTypes.STRING(200) },

  activo: { type: DataTypes.BOOLEAN, defaultValue: true },

  creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'proveedores',
  timestamps: false
});

module.exports = Proveedor;
