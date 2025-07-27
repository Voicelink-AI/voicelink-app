export interface Meeting {
  id: string;
  title: string;
  duration: number;
  participants: string[];
  participants_count: number;
  status: 'processing' | 'completed' | 'failed' | 'scheduled' | 'active' | 'paused' | 'cancelled';
  createdAt: string;
  audioFileName?: string;
  audio_info?: {
    duration: number;
    file_size: number;
    format: string;
    sample_rate: number;
    channels: number;
    url?: string;
  };
  analytics?: {
    sentiment_score: number;
    engagement_score: number;
    speaking_distribution: Array<{
      speaker: string;
      percentage: number;
      duration: number;
    }>;
  };
  processing_info?: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    error_message?: string;
    started_at?: string;
    completed_at?: string;
  };
}

export interface MeetingResult {
  status: 'success' | 'error';
  voicelink_analysis: {
    summary: {
      total_duration: number;
      speakers_detected: number;
      transcribed_segments: number;
    };
    transcripts: Array<{
      text: string;
      speaker: string;
      speaker_id: number;
      start_time: number;
      end_time: number;
      confidence?: number;
    }>;
    code_context: {
      github_references: Array<{
        type: 'issue' | 'pr';
        value: string;
        full_match: string;
      }>;
      technical_terms: string[];
      file_mentions: string[];
    };
  };
  documentation: {
    summary: {
      meeting_title: string;
      participants: string[];
      action_items: string[];
      key_topics: string[];
    };
    markdown: string;
  };
  provenance: {
    document_hash: string;
    timestamp: string;
    provenance_id: string;
  };
}

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  timestamp: string;
}

export interface GitHubReference {
  type: 'issue' | 'pr';
  value: string;
  full_match: string;
}
