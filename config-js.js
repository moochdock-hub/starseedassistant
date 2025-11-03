// Configuration file for Starseed Voice Assistant
// Replace with your actual OpenAI API key

// IMPORTANT: Never commit your actual API key to GitHub!
// Use environment variables in production

const CONFIG = {
  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MODEL: 'gpt-4o-mini', // Fast and affordable model
  
  // App Settings
  APP_NAME: 'Starseed Voice Assistant',
  APP_VERSION: '3.0.0',
  
  // AI Settings
  DEFAULT_PERSONALITY: 'encouraging', // encouraging, clinical, friendly
  MAX_CONVERSATION_HISTORY: 50,
  
  // Health Tracking Settings
  WATER_GOAL: 8, // glasses per day
  SLEEP_GOAL_MIN: 7, // hours
  SLEEP_GOAL_MAX: 9, // hours
  
  // Notification Settings
  ENABLE_NOTIFICATIONS: true,
  
  // Local Storage Key
  STORAGE_KEY: 'starseed-data-v3'
};

// OpenAI API Helper Functions
const OpenAIHelper = {
  async chat(messages, temperature = 0.7) {
    try {
      const response = await fetch(CONFIG.OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: CONFIG.OPENAI_MODEL,
          messages: messages,
          temperature: temperature,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return null;
    }
  },

  // Extract structured health data from user's voice input
  async extractHealthData(userInput, conversationContext = []) {
    const systemPrompt = `You are a health assistant AI that extracts structured information from natural language.
Extract the following from the user's input:
- Appointments (with date, time, title)
- Medications (with name, time, frequency)
- Mood (happy, sad, anxious, calm, stressed, etc.)
- Energy level (1-5 scale: very tired, tired, okay, good, energetic)
- Habits (water intake, exercise, sleep)

Respond in JSON format:
{
  "type": "appointment|medication|mood|energy|habit|question",
  "data": { extracted data },
  "response": "natural language response to user"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext.slice(-5), // Last 5 messages for context
      { role: 'user', content: userInput }
    ];

    const result = await this.chat(messages, 0.3); // Low temperature for structured output
    
    try {
      return JSON.parse(result);
    } catch (e) {
      // If JSON parsing fails, return a simple response
      return {
        type: 'general',
        data: {},
        response: result || "I heard you, but I'm not sure how to help with that. Try asking about appointments, medications, or how you're feeling."
      };
    }
  },

  // Analyze health patterns with AI
  async analyzePatterns(healthData) {
    const systemPrompt = `You are a health insights AI. Analyze the user's health data and provide:
1. Pattern insights (mood trends, energy patterns, medication adherence)
2. Actionable recommendations
3. Potential concerns to watch for

Be empathetic, encouraging, and provide specific advice.`;

    const dataDescription = `
Appointments: ${healthData.appointments.length} scheduled
Medications: ${healthData.medications.length} tracked, ${healthData.medications.reduce((sum, m) => sum + m.taken.length, 0)} doses taken
Mood Logs: ${healthData.moodLog.length} entries - Recent: ${healthData.moodLog.slice(-5).map(m => m.mood).join(', ')}
Energy Logs: ${healthData.energyLog.length} entries - Recent avg: ${healthData.energyLog.length > 0 ? (healthData.energyLog.slice(-7).reduce((sum, e) => sum + e.value, 0) / Math.min(7, healthData.energyLog.length)).toFixed(1) : 0}
Water: ${healthData.habits.water.length} glasses total
Exercise: ${healthData.habits.exercise.length} sessions
Sleep: ${healthData.habits.sleep.length} logs, avg ${healthData.habits.sleep.length > 0 ? (healthData.habits.sleep.reduce((sum, s) => sum + s.hours, 0) / healthData.habits.sleep.length).toFixed(1) : 0} hours
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this health data and provide insights:\n${dataDescription}` }
    ];

    const insights = await this.chat(messages, 0.8);
    return insights || "Keep tracking your health! I'll provide more insights as I learn your patterns.";
  },

  // Generate personalized health report
  async generateReport(healthData, dateRange = '7 days') {
    const systemPrompt = `You are creating a comprehensive health report for a doctor or healthcare provider.
Be professional, precise, and highlight important patterns or concerns.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create a ${dateRange} health report with this data:\n${JSON.stringify(healthData, null, 2)}` }
    ];

    const report = await this.chat(messages, 0.5);
    return report || "Health report generation in progress...";
  }
};

// Export for use in App
window.CONFIG = CONFIG;
window.OpenAIHelper = OpenAIHelper;