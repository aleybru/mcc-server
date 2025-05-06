const bcrypt = require('bcryptjs');

/**
 * Middleware para hashear contraseñas antes de guardar un documento
 * @param {mongoose.Schema} schema
 */
const applyPasswordHashing = (schema) => {
  schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
};

module.exports = applyPasswordHashing;
