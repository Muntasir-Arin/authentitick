const User = require('../models/user');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password, role } = req.body;
  const user = new User({ email, password, role });
  await user.save();
  res.status(201).json({ message: 'User registered successfully.' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: 'Invalid credentials.' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.json({ token });
};

module.exports = { register, login };
