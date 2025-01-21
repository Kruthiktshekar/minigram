import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'token is required' });
  }
  try {
    // eslint-disable-next-line no-undef
    const tokenData = jwt.verify(token, process.env.JWT_SCRETE);
    req.userId = tokenData.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authenticateUser;
