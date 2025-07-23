const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types
export interface MeetingCreateRequest {
  title: string;
  participants: string[];
  scheduled_time?: string;
  description?: string;
}

export interface MeetingResponse {
  id: string;
  title: string;
  participants: string[];
  status: 'scheduled' | 'active' | 'completed';
  scheduled_time?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  transcript?: any;
  ai_summary?: any;
  action_items?: string[];
}

export interface AudioProcessResponse {
  transcript: string;
  speaker_id: string;
  confidence: number;
  timestamp: string;
}

export interface AnalyticsResponse {
  total_meetings: number;
  total_participants: number;
  total_speaking_time: number;
  active_meetings: number;
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

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Meeting Management
  static async createMeeting(meetingData: MeetingCreateRequest): Promise<MeetingResponse> {
    return this.request<MeetingResponse>('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  static async getMeetings(status?: string): Promise<MeetingResponse[]> {
    const params = status ? `?status=${status}` : '';
    return this.request<MeetingResponse[]>(`/meetings${params}`);
  }

  static async getMeeting(meetingId: string): Promise<MeetingResponse> {
    return this.request<MeetingResponse>(`/meetings/${meetingId}`);
  }

  static async startMeeting(meetingId: string): Promise<any> {
    return this.request(`/meetings/${meetingId}/start`, {
      method: 'POST',
    });
  }

  static async endMeeting(meetingId: string): Promise<any> {
    return this.request(`/meetings/${meetingId}/end`, {
      method: 'POST',
    });
  }

  static async getLiveTranscript(meetingId: string): Promise<any> {
    return this.request(`/meetings/${meetingId}/live-transcript`);
  }

  // Audio Processing
  static async uploadAudio(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('audio_file', file);

    const response = await fetch(`${API_BASE_URL}/upload-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Legacy method for backward compatibility
  static async processMeeting(file: File): Promise<any> {
    return this.uploadAudio(file);
  }

  static async processAudio(audioData: string): Promise<AudioProcessResponse> {
    return this.request<AudioProcessResponse>('/process-audio', {
      method: 'POST',
      body: JSON.stringify({ audio_data: audioData }),
    });
  }

  // Analytics
  static async getAnalyticsOverview(): Promise<AnalyticsResponse> {
    return this.request<AnalyticsResponse>('/analytics/overview');
  }

  static async getMeetingInsights(meetingId: string): Promise<any> {
    return this.request(`/analytics/meetings/${meetingId}/insights`);
  }

  static async exportAnalytics(format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/analytics/export/${format}`);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  // LLM Integration
  static async chatWithLLM(prompt: string, model?: string): Promise<LLMResponse> {
    return this.request<LLMResponse>('/llm/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    });
  }

  static async getAvailableModels(): Promise<string[]> {
    return this.request<string[]>('/llm/models');
  }

  // Conversations
  static async getConversations(): Promise<any[]> {
    return this.request<any[]>('/conversations');
  }

  static async createConversation(title: string): Promise<any> {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  // System Status
  static async getSystemStatus(): Promise<SystemStatus> {
    return this.request<SystemStatus>('/status');
  }

  static async getSystemMetrics(): Promise<any> {
    return this.request('/metrics');
  }

  static async getIntegrations(): Promise<any> {
    return this.request('/integrations');
  }

  static async getHealth(): Promise<any> {
    const response = await fetch('http://localhost:8000/health');
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  // Blockchain
  static async getWalletStatus(): Promise<any> {
    return this.request('/blockchain/wallet/status');
  }

  static async recordMeetingOnBlockchain(meetingId: string): Promise<any> {
    return this.request('/blockchain/record-meeting', {
      method: 'POST',
      body: JSON.stringify({ meeting_id: meetingId }),
    });
  }

  static async getBlockchainRecord(meetingId: string): Promise<any> {
    return this.request(`/blockchain/meeting/${meetingId}`);
  }

  // WebSocket Connection
  static connectMeetingWebSocket(meetingId: string): WebSocket {
    return new WebSocket(`ws://localhost:8000/api/v1/ws/meeting/${meetingId}`);
  }
}
