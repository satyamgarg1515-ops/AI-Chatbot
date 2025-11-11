const bannedPhrases = [
  'kill', 'suicide', 'bomb', 'illegal', 'hack', 'drop tables', 'rm -rf'
]; // extend as needed

function safetyFilter(text) {
  const low = (text || '').toLowerCase();
  for (const b of bannedPhrases) {
    if (low.includes(b)) {
      return { ok: false, reason: `Input contains banned content: "${b}"` };
    }
  }
  return { ok: true };
}

module.exports = { safetyFilter };
