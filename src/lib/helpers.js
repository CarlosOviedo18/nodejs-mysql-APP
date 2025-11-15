const bcrypt = require("bcryptjs");

const helpers = {};

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password encriptada:', hash);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    const result = await bcrypt.compare(password, savedPassword);
    console.log('bcrypt.compare resultado:', result);
    return result;
  } catch (e) {
    console.log('Error en matchPassword:', e);
    return false;
  }
};

module.exports = helpers;
