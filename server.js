const express = require("express");
const cors = require('cors');
const app = express();
const auth = require('./routes/users');
const chats = require('./routes/chats');
const messages = require('./routes/messages');
require('dotenv').config();
const mongoose = require('mongoose');
const { initializeSocket } = require('./socket/socket');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URIs, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors({ origin: '*', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("API working on Vercel!"));
app.use('/api/auth', auth);
app.use('/api/chats', chats);
app.use('/api/messages', messages);

module.exports = app; // ✅ export instead of app.listen
