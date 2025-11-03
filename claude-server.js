require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY environment variable. See README_ANTHROPIC.md');
  process.exit(1);
}

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt = '', max_tokens = 300 } = req.body || {};

    const payload = {
      model: 'claude-2',
      prompt,
      max_tokens
    };

    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error calling Anthropic:', err);
    res.status(500).json({ error: 'Claude request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Claude server listening on http://localhost:${port}`));
