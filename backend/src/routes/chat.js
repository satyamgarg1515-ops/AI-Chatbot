const express = require('express');
const { getProvider } = require('../services/providerFactory');
const auth = require('../middlewares/auth');
const { safetyFilter } = require('../middlewares/safety');
const Session = require('../models/Session');
const Message = require('../models/Message');

const router = express.Router();

// Create a session (POST /api/chat/sessions)
router.post('/sessions', auth, async (req, res) => {
  const session = await Session.create({ userId: req.user._id, title: req.body.title || 'New session' });
  res.json(session);
});

// List sessions
router.get('/sessions', auth, async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id }).sort({ lastActivity: -1 }).limit(50);
  res.json(sessions);
});

// Append a user message and stream assistant reply via SSE
// POST /api/chat/stream
router.post('/stream', auth, async (req, res) => {
  /*
    body: { sessionId, provider: 'mock', model, message }
  */
  try {
    const { sessionId, provider = 'mock', model, message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const safety = safetyFilter(message);
    if (!safety.ok) return res.status(400).json({ error: safety.reason });

    // Ensure session exists and belongs to user
    let session;
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (!session) return res.status(400).json({ error: 'Invalid session' });
      if (!session.userId.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
      session.lastActivity = Date.now();
      await session.save();
    } else {
      session = await Session.create({ userId: req.user._id, title: 'Quick session' });
    }

    // Save user message
    const userMsg = await Message.create({ sessionId: session._id, userId: req.user._id, role: 'user', text: message });

    // Setup SSE
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    const prov = getProvider(provider);

    // stream generator yields chunks
    const streamGen = prov.stream(message, { model, userId: req.user._id, sessionId: session._id });

    // collect assistant text progressively
    let assistantText = '';
    for await (const chunk of streamGen) {
      assistantText += chunk;
      // send SSE chunk
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    // on complete, persist assistant message
    const assistantMsg = await Message.create({
      sessionId: session._id,
      role: 'assistant',
      text: assistantText,
      meta: { provider, model }
    });

    // send final event with assistant id
    res.write(`event: done\ndata: ${JSON.stringify({ assistantId: assistantMsg._id, sessionId: session._id })}\n\n`);
    res.end();
  } catch (err) {
    console.error('stream error', err);
    try {
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'server error' })}\n\n`);
      res.end();
    } catch (e) { /* nothing */ }
  }
});

// Get messages for a session
router.get('/sessions/:id/messages', auth, async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Not found' });
  if (!session.userId.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
  const messages = await Message.find({ sessionId: session._id }).sort({ createdAt: 1 }).limit(500);
  res.json(messages);
});

module.exports = router;
