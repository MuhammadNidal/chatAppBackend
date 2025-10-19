
const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
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
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// initializeSocket(server);

// Simple request logger to help debug empty body issues
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Content-Type: ${req.headers['content-type']}`);
  next();
});

// Enable CORS for the Expo web dev server (localhost:8081).
// Adjust origin as needed for production.
app.use(cors({ origin: 'http://localhost:8081', credentials: true }));
// Allow preflight for all routes
app.options('*', cors({ origin: 'http://localhost:8081', credentials: true }));

// Accept text bodies (some clients send JSON with text/plain)
app.use(express.text({ type: ['text/plain', 'application/*+json'], limit: '1mb' }));

// If body was sent as text/plain containing JSON, try to parse it into req.body
app.use((req, res, next) => {
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      req.body = parsed;
    } catch (err) {
      // leave req.body as string if it's not JSON
    }
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/auth', auth);
app.use('/api/chats', chats);
app.use('/api/messages', messages);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
