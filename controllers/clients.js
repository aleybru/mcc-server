const { request, response } = require('express');
const Client = require('../models/client');

// 🔸 Crear cliente
const createClient = async (req = request, res = response) => {
  try {
    const { name, contact_email, phone, address } = req.body;

    const exists = await Client.findOne({ name });
    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un cliente con ese nombre'
      });
    }

    const client = new Client({
      name,
      contact_email,
      phone,
      address,
      createdBy: req.uid
    });

    await client.save();

    res.status(201).json({
      ok: true,
      client
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al crear cliente',
      error: error.message
    });
  }
};

// 🔸 Obtener todos los clientes creados por el usuario
const getClients = async (req = request, res = response) => {
  try {
    const clients = await Client.find({ createdBy: req.uid });

    res.json({
      ok: true,
      count: clients.length,
      clients
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener clientes',
      error: error.message
    });
  }
};

// 🔸 Obtener un cliente específico
const getClient = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        msg: 'Cliente no encontrado'
      });
    }

    res.json({
      ok: true,
      client
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener cliente',
      error: error.message
    });
  }
};

// 🔸 Modificar cliente
const updateClient = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { name, contact_email, phone, address } = req.body;

    const client = await Client.findByIdAndUpdate(id, {
      name, contact_email, phone, address
    }, { new: true });

    res.json({
      ok: true,
      client
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

// 🔸 Desactivar cliente
const disableClient = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(id, { active: false }, { new: true });

    res.json({
      ok: true,
      msg: 'Cliente desactivado',
      client
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al desactivar cliente',
      error: error.message
    });
  }
};

const getMyClient = async (req, res) => {
  try {
      const client = await Client.findOne({ user: req.uid });
      res.json({ ok: true, client });
  } catch (error) {
      console.error('Error al obtener client:', error);
      res.status(500).json({ ok: false, msg: 'Error al obtener cliente' });
  }
};

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  disableClient,
  getMyClient
};
