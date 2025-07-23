export interface Meeting {
  id: string;
  title: string;
  duration: number;
  participants: string[];
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  audioFileName?: string;
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
      speaker_id: number;
      start_time: number;
      end_time: number;
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
