import bcrypt from 'bcryptjs';

/**
 * This function used to create a hash value of given pramas and return hashed value
 * @param {String} data - string data extracted from request
 * @returns {String} - returns the hashed value
 */
const hashData = async (data) => {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data, salt);
    return hash;
  } catch (error) {
    console.log('[ERROR] in bcrypt', error);
    throw new Error('Error while hashing data');
  }
};

export default hashData;
