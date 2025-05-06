const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateUploads = require('../middlewares/validate-uploads');
const hashPassword = require('../middlewares/hash-password');

module.exports = {
    ...validateRoles,
    ...validateFields,
    ...validateJWT,
    ...validateUploads, 
    ...hashPassword
}