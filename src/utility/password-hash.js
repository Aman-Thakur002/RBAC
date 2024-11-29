const bcrypt = require('bcrypt')

// Hash the password securely
 const hashPassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Use configurable salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

// Compare plaintext password with hashed password
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = {hashPassword,comparePassword}


