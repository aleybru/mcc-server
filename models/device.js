const { Schema, model } = require('mongoose');

const DeviceSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre del dispositivo es obligatorio']
  },
  phone: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio']
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  platform: {
    type: String,
    enum: ['ANDROID', 'IOS'],
    default: 'ANDROID'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date
  },
  notes: {
    type: String
  }
});

DeviceSchema.methods.toJSON = function () {
  const { __v, _id, ...device } = this.toObject();
  device.did = _id;
  return device;
};

module.exports = model('Device', DeviceSchema);
