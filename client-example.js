// Simple client example that calls the local server endpoint
// Run the server and then run this file or call from browser code.

async function askClaude(prompt) {
  const res = await fetch('http://localhost:3000/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await res.json();
  console.log('Claude response:', JSON.stringify(data, null, 2));
}

// Example usage
askClaude('Write a short friendly greeting.');
