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
const PORT = process.env.PORT || 3000;
// accept several common environment variable names for compatibility
const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URIs || process.env.MONGO_URL ||"mongodb+srv://nidal:121212121212@mychatapp.r0hvovp.mongodb.net/?retryWrites=true&w=majority&appName=MyChatApp";
if (!mongoUri) {
  console.error('MongoDB connection error: no MongoDB URI provided. Set MONGODB_URI in environment.');
} else if (!mongoose.connection.readyState) {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,           
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
}

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

module.exports = app; // ✅ export the app for serverless (Vercel) or tests

// Start the HTTP server only when this file is run directly (e.g. in Docker or local)
// if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
// }
