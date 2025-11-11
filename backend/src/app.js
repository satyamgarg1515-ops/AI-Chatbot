const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

// Global rate limiter (demo)
app.use(rateLimiter.globalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'AI Chatbot Backend' }));

module.exports = app;
