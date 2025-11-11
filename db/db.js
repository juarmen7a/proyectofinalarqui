// db/db.js
const { Sequelize } = require('sequelize')
require('dotenv').config()

//Configuración de Sequelize
let sequelize

//Variables de entorno para Railway
if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL
  sequelize = new Sequelize(connectionUrl, {
    dialect: 'mysql',
    logging: false,
  })
  console.log('Usando conexión a MySQL de Railway')
} else {
  //Modo local
  sequelize = new Sequelize(
    process.env.DB_NAME || 'bd_pollo',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: process.env.DB_DIALECT || 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false,
    }
  )
  console.log('Usando conexión local a MySQL')
}

// Prueba inmediata de conexión
sequelize.authenticate()
  .then(() => console.log('Conectado correctamente a la base de datos'))
  .catch(err => console.error('Error al conectar con la base de datos:', err.message))

module.exports = sequelize