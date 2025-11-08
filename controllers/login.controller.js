'use strict';

const jwt = require('jsonwebtoken');
const Login = require('../models/login.model');
const usuarios = require('../models/usuarios.model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
const TTL_MS = 2 * 60 * 60 * 1000; // 2 horas

const now = () => new Date();
const inMs = (ms) => new Date(Date.now() + ms);

exports.getSesiones = async (_req, res) => {
  try {
    const sesiones = await Login.findAll();
    res.status(200).json(sesiones);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener las sesiones' });
  }
};

exports.getSesionById = async (req, res) => {
  try {
    const sesion = await Login.findByPk(req.params.id);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.status(200).json(sesion);
  } catch (error) {
    res.status(500).json({ error, message: 'Error al obtener la sesión' });
  }
};

exports.createSesion = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || password == null) {
      return res.status(400).json({ message: 'Debe ingresar email y contraseña' });
    }

    // Buscar usuario
    const usuario = await usuarios.findOne({ where: { correo: email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si ya tiene sesión activa
    const sesionActiva = await Login.findOne({ where: { usuario_id: usuario.id } });
    if (sesionActiva) {
      return res.status(409).json({
        message: `Ya existe una sesión activa para el usuario ${usuario.nombre_completo}`
      });
    }

    // Validar estado (si existe)
    if (usuario.activo !== undefined && usuario.activo === 0) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    // Validar contraseña (sin encriptar)
    if (String(usuario.contrasena) !== String(password)) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const payload = { id: usuario.id, nombre: usuario.nombre_completo, email: usuario.correo };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Guardar sesión
    const sesion = await Login.create({
      usuario_id: usuario.id,
      token_hash: token,
      issued_at: now(),
      expires_at: inMs(TTL_MS)
    });

    res.status(201).json({
      message: `Inicio de sesión exitoso, bienvenido ${usuario.nombre_completo}`,
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

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(400).json({ message: 'Debe enviar el token en Authorization: Bearer <token>' });

    const sesion = await Login.findOne({ where: { token_hash: token } });
    if (!sesion) return res.status(404).json({ message: 'Sesión no encontrada o ya cerrada' });

    await sesion.destroy();
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ error, message: 'Error al cerrar sesión' });
  }
};

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
