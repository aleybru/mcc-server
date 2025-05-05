const { Schema, model } = require('mongoose');

const ClientSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la empresa es obligatorio'],
    unique: true,
    trim: true
  },
  contact_email: {
    type: String,
    required: [true, 'El email de contacto es obligatorio'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'El teléfono de contacto es obligatorio']
  },
  address: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

ClientSchema.methods.toJSON = function () {
  const { __v, _id, ...client } = this.toObject();
  client.cid = _id;
  return client;
};

module.exports = model('Client', ClientSchema);
