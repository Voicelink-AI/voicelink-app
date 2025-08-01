import axios from 'axios';
import { type MeetingResult, type ChatMessage } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const processMeeting = async (audioFile: File): Promise<MeetingResult> => {
  const formData = new FormData();
  formData.append('audio_file', audioFile);
  
  const response = await api.post('/process-meeting', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const askQuestion = async (question: string): Promise<{
  answer: string;
  confidence: number;
  sources: string[];
}> => {
  const response = await api.post('/ask-question', {
    question,
  });
  
  return response.data;
};

export const getHealth = async (): Promise<{ status: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export const getCapabilities = async (): Promise<{
  supported_formats: string[];
  max_file_size: number;
  features: string[];
}> => {
  const response = await api.get('/capabilities');
  return response.data;
};
