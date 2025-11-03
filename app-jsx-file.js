// Copy the ENTIRE Starseed Voice Assistant code from the artifact above
// This is the complete React application

// Note: Due to character limits, you need to copy the full code from the
// "starseed-voice-assistant" artifact above into this file

// The code starts with:
// import React, { useState, useEffect, useRef } from 'react';
// import { Mic, MicOff, Calendar... } from 'lucide-react';

// And ends with:
// export default StarseedVoiceAssistant;

// IMPORTANT: In the processVoiceCommand function, ADD this AI enhancement:

const processVoiceCommandWithAI = async (text) => {
  // Try OpenAI first for better understanding
  if (window.CONFIG && window.OpenAIHelper && window.CONFIG.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE') {
    try {
      const result = await window.OpenAIHelper.extractHealthData(text, conversationHistory);
      
      if (result.type === 'appointment' && result.data) {
        setAppointments(prev => [...prev, {
          id: Date.now(),
          title: result.data.title || 'Appointment',
          date: result.data.date || 'Not specified',
          time: result.data.time || 'Not specified',
          completed: false,
          timestamp: new Date().toISOString()
        }]);
        speak(result.response);
        return;
      }
      
      if (result.type === 'medication' && result.data) {
        setMedications(prev => [...prev, {
          id: Date.now(),
          name: result.data.name || 'Medication',
          time: result.data.time || '8:00 AM',
          frequency: result.data.frequency || 'daily',
          taken: [],
          missedDoses: 0,
          timestamp: new Date().toISOString()
        }]);
        speak(result.response);
        return;
      }
      
      if (result.type === 'mood' && result.data) {
        setMoodLog(prev => [...prev, {
          id: Date.now(),
          mood: result.data.mood,
          emoji: result.data.emoji || '😊',
          intensity: result.data.intensity || 'moderate',
          timestamp: new Date().toISOString(),
          note: text
        }]);
        speak(result.response);
        return;
      }
      
      // If AI processed it, use AI response
      if (result.response) {
        speak(result.response);
        return;
      }
    } catch (error) {
      console.error('AI processing error:', error);
      // Fall back to built-in processing
    }
  }
  
  // Original built-in processing as fallback
  processVoiceCommand(text);
};

// NOTE: Replace the processVoiceCommand call in the speech recognition
// with processVoiceCommandWithAI for AI-enhanced understanding