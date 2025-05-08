import { Request, Response } from 'express';
import axios from 'axios';

// Configuration for AI-NLP service
const AI_NLP_SERVICE_URL = process.env.AI_NLP_SERVICE_URL || 'http://localhost:3001'; // Update with actual URL

export const handleNLPQuery = async (req: Request, res: Response) => {
  try {
    const { query, employeeId } = req.body;

    if (!query || !employeeId) {
      return res.status(400).json({ 
        message: 'Missing required fields: query and employeeId are required' 
      });
    }

    // Call AI-NLP service
    const nlpResponse = await axios.post(`${AI_NLP_SERVICE_URL}/analyze`, {
      query,
      employeeId
    });

    // Transform the response to match our expected format
    const response = {
      intent: nlpResponse.data.intent,
      parsed: {
        date: nlpResponse.data.date || new Date().toISOString().split('T')[0],
        deskType: nlpResponse.data.deskType || 'any',
        locationHint: nlpResponse.data.locationHint || 'any',
        noiseLevel: nlpResponse.data.noiseLevel || 'any'
      },
      suggestedDesks: []
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing NLP query:', error);
    res.status(500).json({ 
      message: 'Error processing natural language query', 
      error: (error as Error).message 
    });
  }
}; 