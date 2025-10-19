const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

async function register(req, res) {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'username, email and password are required' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username or email already in use' });
    }
    // coerce password to string (handles numeric passwords sent as numbers)
    const passwordStr = String(password);
    const hashedPassword = await bcrypt.hash(passwordStr, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ msg: 'User registered successfully', userId: newUser._id, username: newUser.username ,email: newUser.email  });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
}

async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ msg: 'username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    const passwordStr = String(password);
    const isMatch = await bcrypt.compare(passwordStr, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const safeUser = {
      id: user._id,
      username: user.username || user.name,
      email: user.email,
      avatar: user.avatar || user.avatarImage || null,
    };
    return res.status(200).json({ token, user: safeUser });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
}
async function getProfile(req, res) {
  const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) { 
        return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];         
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('getProfile error:', error);
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }   
}

async function updateProfile(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    const { username, email, avatarImage } = req.body || {};
    if (!username && !email && !avatarImage) {
        return res.status(400).json({ msg: 'At least one field (username, email, avatarImage) is required to update' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (avatarImage) updateData.avatarImage = avatarImage;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
  // Implementation for updating user profile
}
async function logout(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ msg: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ msg: 'User logged out successfully' });
    } catch (error) {
        console.error('logout error:', error);
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
    // Implementation for user logout
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find({ _id: { $ne: req.params.userId } }).select('-password');
        return res.status(200).json(users);
    } catch (error) {
        console.error('getAllUsers error:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = { register, login ,getProfile, updateProfile, logout, getAllUsers };