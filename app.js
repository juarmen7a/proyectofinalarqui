const express = require('express');
require('dotenv').config();

const sequelize = require('./db/db');

// Importar rutas
const empresasRoutes = require('./routes/empresas.routes');
const sucursalesRoutes = require('./routes/sucursales.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const rolesRoutes = require('./routes/roles.routes');
const usuariosrolesRoutes = require('./routes/usuarioroles.routes');
const unidadesRoutes = require('./routes/unidades.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const productosRoutes = require('./routes/productos.routes');
const almacenesRoutes = require('./routes/almacenes.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const movimientosRoutes = require('./routes/movimientos.routes');
const ventasRoutes = require('./routes/ventas.routes');
const detalleVentasRoutes = require('./routes/detalleventas.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const comprasRoutes = require('./routes/compras.routes');
const loginRoutes = require('./routes/login.routes');

const app = express();
app.use(express.json());

// Maquetar rutas
app.use('/api', empresasRoutes);
app.use('/api', sucursalesRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', rolesRoutes);
app.use('/api', usuariosrolesRoutes);
app.use('/api', unidadesRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', productosRoutes);
app.use('/api', almacenesRoutes);
app.use('/api', inventarioRoutes);
app.use('/api', movimientosRoutes);
app.use('/api', ventasRoutes);
app.use('/api', detalleVentasRoutes);
app.use('/api', proveedoresRoutes);
app.use('/api', comprasRoutes);
app.use('/api', loginRoutes);



// Ruta principal para comprobar el servidor
app.get('/', (req, res) => {
  res.send('✅ API BD_Pollo funcionando correctamente');
});

// Iniciar servidor y conectar DB
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
    console.log('Base de datos conectada correctamente');
  });
}).catch(err => {
  console.error('Error al conectar la base de datos:', err);
});
