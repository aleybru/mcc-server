const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const uploads = require('./uploads');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...uploads
}