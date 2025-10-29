// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// module.exports = async (req, res, next) => {
// 	const authHeader = req.headers.authorization || req.headers.Authorization;
// 	if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ msg: 'Unauthorized' });

// 	const token = authHeader.split(' ')[1];
// 	try {
// 		const decoded = jwt.verify(token, JWT_SECRET);
// 		const user = await User.findById(decoded.id).select('-password');
// 		if (!user) return res.status(401).json({ msg: 'Unauthorized' });
// 		req.user = user;
// 		next();
// 	} catch (err) {
// 		console.error('auth middleware error:', err);
// 		return res.status(401).json({ msg: 'Unauthorized' });
// 	}
// };
