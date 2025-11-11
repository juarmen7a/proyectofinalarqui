// controllers/login.controller.js
const jwt = require('jsonwebtoken');
const Login = require('../models/login.model');
const usuarios = require('../models/usuarios.model');

// Cargar variables de entorno
require('dotenv').config();

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
const TTL_MS = 2 * 60 * 60 * 1000; // 2 horas

// Funciones auxiliares
const now = () => new Date();
const inMs = (ms) => new Date(Date.now() + ms);

// Obtener la lista de sesiones
exports.getSesiones = async (_req, res) => {
  try {
    const sesiones = await Login.findAll();
    res.status(200).json(sesiones);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener las sesiones' });
  }
};

// Obtener una sesión por ID
exports.getSesionById = async (req, res) => {
  try {
    const sesion = await Login.findByPk(req.params.id);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.status(200).json(sesion);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener la sesión' });
  }
};

// Crear una nueva sesión (login)
exports.createSesion = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || password == null) {
      return res.status(400).json({ message: 'Debe ingresar email y contraseña' });
    }

    // Buscar usuario por correo
    const usuario = await usuarios.findOne({ where: { correo: email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si ya hay una sesión activa
    const sesionActiva = await Login.findOne({ where: { usuario_id: usuario.id } });
    if (sesionActiva) {
      return res.status(409).json({
        message: `Ya existe una sesión activa para el usuario ${usuario.nombre_completo}`
      });
    }

    // Verificar si el usuario está activo
    if (usuario.activo !== undefined && usuario.activo === 0) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    // Verificar contraseña (texto plano)
    if (String(usuario.contrasena) !== String(password)) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const payload = { id: usuario.id, nombre: usuario.nombre_completo, email: usuario.correo };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Crear registro de sesión
    const sesion = await Login.create({
      usuario_id: usuario.id,
      token_hash: token,
      issued_at: now(),
      expires_at: inMs(TTL_MS)
    });

    res.status(201).json({
      message: `Inicio de sesión exitoso, Bienvenido ${usuario.nombre_completo}`,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        email: usuario.correo
      },
      token,
      sesion_id: sesion.id
    });
  } catch (error) {
    res.status(500).json({ error, message: 'Error al iniciar sesión' });
  }
};

// Actualiza la contraseña de un usuario
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password_actual, password_nueva } = req.body;

    if (!password_actual || !password_nueva) {
      return res.status(400).json({ message: 'Debe ingresar la contraseña actual y la nueva' });
    }

    const usuario = await usuarios.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (usuario.activo === 0) return res.status(403).json({ message: 'Usuario inactivo' });

    // Validar contraseña actual
    if (String(usuario.contrasena) !== String(password_actual)) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    await usuario.update({ contrasena: String(password_nueva) });
    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};

// Elimina una sesión (logout)
exports.deleteSesion = async (req, res) => {
  try {
    const { id } = req.params; // ID de la sesión (tabla login)
    const sesion = await Login.findByPk(id);
    if (!sesion) return res.status(404).json({ message: 'Sesión no encontrada' });

    // Buscar usuario para mensaje personalizado
    const usuario = await usuarios.findByPk(sesion.usuario_id);

    await sesion.destroy();

    const nombreUsuario = usuario ? usuario.nombre_completo : `ID ${sesion.usuario_id}`;
    return res.status(200).json({
      message: `El usuario ${nombreUsuario} salió exitosamente`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la sesión' });
  }
};

// Verifica la validez de un token JWT
exports.verificarToken = async (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(400).json({ message: 'Debe enviar un token válido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const sesion = await Login.findOne({ where: { token_hash: token } });
    if (!sesion) return res.status(401).json({ message: 'Sesión no válida o cerrada' });

    if (sesion.expires_at && new Date(sesion.expires_at) < new Date()) {
      return res.status(401).json({ message: 'Sesión expirada' });
    }

    res.status(200).json({ message: 'Token válido', usuario: decoded });
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
