// models/login.model.js
const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Definición del modelo Login, para gestionar tokens de sesión
const Login = db.define('login', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  token_hash: { type: DataTypes.TEXT, allowNull: false },
  issued_at: { type: DataTypes.DATE, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'login',
  timestamps: false
});

module.exports = Login;
