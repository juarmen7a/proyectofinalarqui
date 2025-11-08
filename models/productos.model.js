const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Producto = db.define('productos', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  empresa_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  categoria_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  unidad_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  tipo: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  codigo: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  descripcion: { 
    type: DataTypes.STRING(255) 
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'productos',
  timestamps: false
});

module.exports = Producto;
