require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

async function run() {
  await connectDB();
  const email = 'demo@ai.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User exists:', existing.email);
    process.exit(0);
  }
  const passwordHash = await User.hashPassword('password123');
  const user = await User.create({ email, name: 'Demo User', passwordHash });
  console.log('Created demo user:', user.email, 'pw: password123');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
