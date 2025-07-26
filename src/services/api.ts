const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types - Updated to match actual API responses
export interface MeetingCreateRequest {
  title: string;
  participants: string[];
  scheduled_time?: string;
  description?: string;
}

export interface MeetingResponse {
  meeting_id: string;
  title: string;
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  participants: Array<{
    email: string;
    status?: string;
    speaking_time?: number;
  }>;
  start_time?: string;
  end_time?: string;
  recording_url?: string;
  transcript?: string;
  ai_summary?: string;
  action_items?: string[];
  description?: string; // <-- Add this
  created_at?: string;  // <-- Add this
}

export interface AudioProcessResponse {
  success: boolean;
  transcription: string;
  llm_response: string;
  confidence_score: number;
  processing_time_ms: number;
  error: string;
}

export interface AnalyticsResponse {
  total_meetings: number;
  total_participants: number;
  total_minutes_recorded: number;
  total_speaking_time: number; // Fixed: Added this property
  avg_meeting_duration: number;
  active_meetings: number; // Fixed: Added this property
  top_speakers: Array<{
    name: string;
    total_speaking_time: number;
    meetings: number;
  }>;
  sentiment_analysis: Record<string, number>;
  word_cloud_data: Array<{
    word: string;
    frequency: number;
  }>;
}

export interface LLMResponse {
  response: string;
  model: string;
  confidence: number;
  tokens_used: number;
}

export interface SystemStatus {
  audio_engine: 'healthy' | 'degraded' | 'down';
  llm: 'healthy' | 'degraded' | 'down';
  blockchain: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
}

export class VoiceLinkAPI {
  
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch (parseError) {
          console.warn('Could not parse error response as JSON:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (networkError) {
      if (networkError instanceof TypeError && networkError.message.includes('fetch')) {
        throw new Error('Cannot connect to VoiceLink API. Please ensure the backend server is running.');
      }
      throw networkError;
    }
  }

  // FIXED: Upload audio with better error handling
  static async uploadAudio(file: File): Promise<any> {
    try {
      console.log('🔧 Uploading file:', file.name, 'Size:', file.size);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/v1/upload-audio', {
        method: 'POST',
        body: formData,
      });

      console.log('📤 Upload response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const responseText = await response.text();
          console.log('📤 Upload error response text:', responseText);
          
          const errorData = JSON.parse(responseText);
          console.log('📤 Parsed upload error:', errorData);
          
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = `Upload failed (${response.status}): ${responseText}`;
          }
        } catch (parseError) {
          console.warn('Could not parse upload error as JSON:', parseError);
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      try {
        const responseText = await response.text();
        console.log('📤 Upload success response text:', responseText);
        
        const responseData = JSON.parse(responseText);
        console.log('📤 Parsed upload success data:', responseData);
        
        return responseData;
      } catch (parseError) {
        console.error('Could not parse upload success response:', parseError);
        throw new Error('Upload succeeded but response was not valid JSON');
      }

    } catch (error) {
      console.error('Upload audio error:', error);
      
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === 'object' && error !== null) {
        const errorStr = JSON.stringify(error);
        throw new Error(`Network error: ${errorStr}`);
      } else {
        throw new Error(String(error));
      }
    }
  }

  // FIXED: Use the recommended JSON endpoint for meeting creation
  static async createMeetingFromFile(fileId: string, title?: string): Promise<any> {
    try {
      console.log('🔧 Calling create-meeting-from-file-json with:', { fileId, title });
      
      // Use the recommended JSON endpoint
      const response = await fetch('http://localhost:8000/api/v1/create-meeting-from-file-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_id: fileId,
          title: title || 'VoiceLink Meeting'
        })
      });

      console.log('📋 Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Meeting creation failed: ${response.status} ${response.statusText}`;
        
        try {
          const responseText = await response.text();
          console.log('📋 Error response text:', responseText);
          
          // Try to parse as JSON for better error message
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (jsonError) {
            // If not JSON, use the raw response text
            errorMessage = `Meeting creation failed (${response.status}): ${responseText}`;
          }
        } catch (readError) {
          console.warn('Could not read response text:', readError);
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      try {
        const responseText = await response.text();
        console.log('📋 Success response text:', responseText);
        
        const responseData = JSON.parse(responseText);
        console.log('📋 Parsed success data:', responseData);
        
        return responseData;
      } catch (parseError) {
        console.error('Could not parse success response:', parseError);
        throw new Error('Meeting creation succeeded but response was not valid JSON');
      }
      
    } catch (error) {
      console.error('Create meeting from file error:', error);
      
      // Ensure we always throw an Error object
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unknown error: ${String(error)}`);
      }
    }
  }

  // FIXED: Meeting endpoints using correct HTTP methods
  static async getMeetings(status?: string, limit: number = 10): Promise<MeetingResponse[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', limit.toString());
      
      // Use GET method explicitly
      const response = await fetch(`${API_BASE_URL}/meetings?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meetings: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Get meetings error:', error);
      throw error;
    }
  }

  static async getMeeting(meetingId: string): Promise<MeetingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Get meeting error:', error);
      throw error;
    }
  }

  // ADDED: Missing startMeeting method
  static async startMeeting(meetingId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to start meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Start meeting error:', error);
      throw error;
    }
  }

  // ADDED: Missing endMeeting method
  static async endMeeting(meetingId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to end meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('End meeting error:', error);
      throw error;
    }
  }

  // ADDED: Additional meeting management methods
  static async pauseMeeting(meetingId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/pause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to pause meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Pause meeting error:', error);
      throw error;
    }
  }

  static async resumeMeeting(meetingId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to resume meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Resume meeting error:', error);
      throw error;
    }
  }

  // ADDED: Get live transcript method
  static async getLiveTranscript(meetingId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/live-transcript`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get live transcript: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Get live transcript error:', error);
      throw error;
    }
  }

  // ADDED: Update meeting method
  static async updateMeeting(meetingId: string, updateData: Partial<MeetingResponse>): Promise<MeetingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update meeting error:', error);
      throw error;
    }
  }

  // ADDED: Delete meeting method
  static async deleteMeeting(meetingId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete meeting error:', error);
      throw error;
    }
  }

  // FIXED: Create meeting using proper JSON format
  static async createMeeting(meetingData: any): Promise<MeetingResponse> {
    try {
      // Format the meeting data according to your API spec
      const formattedData = {
        title: meetingData.title,
        description: meetingData.description || '',
        participants: meetingData.participants || [],
        scheduled_start: meetingData.scheduled_start || new Date().toISOString(),
        duration_minutes: meetingData.duration_minutes || 60,
        recording_enabled: meetingData.recording_enabled !== false,
        transcription_enabled: meetingData.transcription_enabled !== false,
        ai_summary_enabled: meetingData.ai_summary_enabled !== false
      };

      const response = await fetch(`${API_BASE_URL}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        let errorMessage = `Create meeting failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (parseError) {
          console.warn('Could not parse create meeting error:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Create meeting error:', error);
      throw error;
    }
  }

  // Audio Processing
  static async processAudio(audioData: string, format: string = 'wav'): Promise<AudioProcessResponse> {
    try {
      return await this.request<AudioProcessResponse>('/process-audio', {
        method: 'POST',
        body: JSON.stringify({
          audio_data: audioData,
          format,
          language: 'auto'
        })
      });
    } catch (error) {
      console.error('Process audio failed:', error);
      
      if (error instanceof Error && error.message.includes('501')) {
        throw new Error('Audio processing feature is not yet implemented in the backend');
      }
      
      throw error;
    }
  }

  static async getSupportedFormats(): Promise<any> {
    return this.request('/supported-formats');
  }

  // Legacy method for backward compatibility
  static async processMeeting(file: File): Promise<any> {
    return this.uploadAudio(file);
  }

  // Analytics
  static async getAnalyticsOverview(): Promise<AnalyticsResponse> {
    try {
      return await this.request<AnalyticsResponse>('/analytics/overview');
    } catch (error) {
      console.error('Analytics overview error:', error);
      // Return empty analytics instead of throwing
      return {
        total_meetings: 0,
        total_participants: 0,
        total_minutes_recorded: 0,
        total_speaking_time: 0,
        avg_meeting_duration: 0,
        active_meetings: 0,
        top_speakers: [],
        sentiment_analysis: {},
        word_cloud_data: []
      };
    }
  }

  static async exportAnalytics(format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/analytics/export/${format}`);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  // LLM Integration
  static async chatWithLLM(prompt: string, model: string = 'gpt-3.5-turbo'): Promise<any> {
    return this.request('/llm/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        model,
        max_tokens: 150,
        temperature: 0.7
      })
    });
  }

  static async getAvailableModels(): Promise<string[]> {
    const response = await this.request<any>('/llm/models');
    return response.models || [];
  }

  // Conversations
  static async getConversations(): Promise<any[]> {
    // Using meetings as conversations for now
    const meetings = await this.getMeetings();
    return meetings.map(meeting => ({
      id: meeting.meeting_id,
      title: meeting.title,
      updated_at: meeting.start_time
    }));
  }

  static async createConversation(title: string): Promise<any> {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  // System Status
  static async getSystemStatus(): Promise<any> {
    return this.request('/status');
  }

  static async getSystemMetrics(): Promise<any> {
    return this.request('/metrics');
  }

  static async getIntegrations(): Promise<any> {
    return this.request('/integrations');
  }

  static async getHealth(): Promise<any> {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Blockchain
  static async getWalletStatus(): Promise<any> {
    return this.request('/blockchain/wallet/status');
  }

  static async recordMeetingOnBlockchain(meetingId: string): Promise<any> {
    return this.request(`/blockchain/record-meeting?meeting_id=${meetingId}`, {
      method: 'POST',
    });
  }

  static async getBlockchainRecord(meetingId: string): Promise<any> {
    return this.request(`/blockchain/meeting/${meetingId}`);
  }

  // WebSocket Connection
  static connectMeetingWebSocket(meetingId: string): WebSocket {
    return new WebSocket(`ws://localhost:8000/api/v1/ws/meeting/${meetingId}`);
  }

  // Additional Methods
  static async getTranscript(meetingId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/transcript`);
    return response.json();
  }

  static async getCodeContext(meetingId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/code-context`);
    return response.json();
  }

  static async queryMeeting(meetingId: string, question: string): Promise<LLMResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Failed to query meeting: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Query meeting error:', error);
      throw error;
    }
  }
}
