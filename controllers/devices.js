const { request, response } = require('express');
const Device = require('../models/device');

// 🔸 Registrar un dispositivo
const createDevice = async (req = request, res = response) => {
  try {
    const { name, phone, platform, client, notes } = req.body;

    const exists = await Device.findOne({ phone, client });
    if (exists) {
      return res.status(400).json({
        ok: false,
        msg: 'Ese número ya está registrado para ese cliente'
      });
    }

    const device = new Device({
      name,
      phone,
      platform,
      client,
      notes
    });

    await device.save();

    res.status(201).json({
      ok: true,
      device
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al registrar dispositivo',
      error: error.message
    });
  }
};

// 🔸 Obtener dispositivos de un cliente
const getDevicesByClient = async (req = request, res = response) => {
  try {
    const { clientId } = req.params;
    const devices = await Device.find({ client: clientId });

    res.json({
      ok: true,
      devices
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener dispositivos',
      error: error.message
    });
  }
};

// 🔸 Desactivar dispositivo
const deactivateDevice = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const device = await Device.findByIdAndUpdate(id, { isActive: false }, { new: true });

    res.json({
      ok: true,
      msg: 'Dispositivo desactivado',
      device
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al desactivar dispositivo',
      error: error.message
    });
  }
};

module.exports = {
  createDevice,
  getDevicesByClient,
  deactivateDevice
};
