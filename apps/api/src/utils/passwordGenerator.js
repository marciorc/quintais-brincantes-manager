const crypto = require('crypto');

function generateSecurityPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

module.exports = { generateSecurityPassword };