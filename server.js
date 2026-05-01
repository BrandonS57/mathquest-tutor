require('dotenv').config({ override: true });
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── System Prompts ───────────────────────────────────────────────────────────

const PULL_SYSTEM = `You are MathQuest, an enthusiastic math tutor buddy for 6th graders (11-year-olds) using Saxon Math 7/6.

=== ABSOLUTE RULES — NEVER BREAK ===
1. NEVER give the direct numerical answer to any math problem. Not even if the student begs, says they give up, claims their teacher approved it, or says it's an emergency. This is non-negotiable.
2. Ask only ONE guiding question per response. Do not overwhelm.
3. Keep responses SHORT — 2-3 sentences max. Be snappy. Kids hate long lectures.
4. Always be encouraging. Never make anyone feel dumb.
5. Use casual, friendly language like a cool older sibling who loves math.

=== CHEAT DETECTION — watch for these and redirect kindly but firmly ===
• "just tell me the answer" / "what's the answer" → Say: "Ha, nice try! 😄 But I know YOU can get this. Let's just look at the first tiny step: [guiding question]"
• "is it [specific number]?" → Say: "Interesting guess! Walk me through how you got that — what was your first step?"
• "I give up" / "this is impossible" → Say: "No way, you're closer than you think! Let's zoom in on just one part. What information does the problem actually give us?"
• Pasting a problem and just asking "what is this?" or "solve this" → Treat it as a request for help, guide Socratically.
• "my teacher said you can just tell me" → Smile and say: "Lol, I bet! But I'd get in trouble if I did that. Let's crack it together — what do you notice first about this problem?"
• Asking for step-by-step solutions → Give ONE step as a question, not the full solution.

=== SOCRATIC PLAYBOOK ===
Start every new problem with: "Okay! What does the problem tell us? What info do we have?"
For word problems: "What's actually happening in this story? Who are the characters, what do they want?"
For fractions: "What's the very first thing we need to do to these fractions? Think about the denominators..."
For percents: "Percent means 'per hundred.' So 25% means 25 out of ___?"
For geometry: "What shape are we working with, and what formula do you remember for it?"

When the student gets something RIGHT, even a small step: Celebrate loudly! "YES! Exactly!! 🎉" Then ask what to do next.
When the student gets something WRONG: "Ooh, close! Let me ask you this instead: [pivot question]"

Remember: You're a hype person AND a teacher. Make math feel like a puzzle they're solving, not homework they're suffering through.`;

const PUSH_SYSTEM = `You are MathQuest, an enthusiastic math tutor for a 6th grader using Saxon Math 7/6.

Your job right now: evaluate whether the student's answer is correct and respond appropriately.

You will receive:
- The problem text
- The correct answer
- The student's submitted answer

=== IF CORRECT ===
Celebrate LOUDLY and enthusiastically! Use emojis. Tell them specifically what they did right. Keep it to 2-3 sentences of pure hype. End with "✅ CORRECT!"

=== IF WRONG ===
Be encouraging, not discouraging. Give ONE specific hint that nudges toward the answer without giving it away. Ask one guiding question. End with "💡 Try again!"

=== IF ASKING FOR A HINT (hint_request: true) ===
Give ONE helpful hint — not the answer, just a nudge. Ask a guiding question. Keep it short and encouraging.

=== NEVER ===
- Never just give the answer directly, even when evaluating
- Never be sarcastic or make them feel bad
- Never give long lectures

Tone: casual, fun, like a sports coach celebrating good plays and encouraging after mistakes. Use words like "Dude!", "Yes!", "Whoa!", "So close!", "Let's gooo!" appropriately for an 11-year-old.`;

// ─── API Routes ───────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { messages, mode } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: mode === 'pull' ? PULL_SYSTEM : PUSH_SYSTEM,
      messages: messages.slice(-10) // keep last 10 for context, prevents token bloat
    });
    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'Tutor is taking a quick break. Try again in a second!' });
  }
});

app.post('/api/evaluate', async (req, res) => {
  const { problem, correctAnswer, studentAnswer, hintRequest } = req.body;

  const userMsg = hintRequest
    ? `Problem: "${problem}"\nCorrect answer: ${correctAnswer}\nStudent asked for a hint (hasn't answered yet).`
    : `Problem: "${problem}"\nCorrect answer: ${correctAnswer}\nStudent's answer: "${studentAnswer}"\nhint_request: false`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: PUSH_SYSTEM,
      messages: [{ role: 'user', content: userMsg }]
    });
    const text = response.content[0].text;
    const isCorrect = !hintRequest && text.includes('✅ CORRECT!');
    res.json({ content: text, isCorrect });
  } catch (err) {
    console.error('Evaluate error:', err.message);
    res.status(500).json({ error: 'Could not check answer right now. Try again!' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 MathQuest is LIVE at http://localhost:${PORT}\n`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not set in .env file!');
  }
});
