require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';
const ANTHROPIC_VERSION = process.env.ANTHROPIC_VERSION || '2023-06-01';

if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY environment variable. See README_ANTHROPIC.md');
  process.exit(1);
}

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt = '', max_tokens = 300 } = req.body || {};

    const payload = {
      model: MODEL,
      max_tokens,
      messages: [
        { role: 'user', content: prompt }
      ]
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': ANTHROPIC_VERSION
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(response.status).json({ error: 'Anthropic API error', details: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error calling Anthropic:', err);
    res.status(500).json({ error: 'Claude request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Claude server listening on http://localhost:${port}`));
