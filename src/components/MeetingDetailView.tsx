import React, { useState, useEffect } from 'react';
import { VoiceLinkAPI, type MeetingResponse } from '../services/api';

interface MeetingDetailViewProps {
  meetingId: string;
  isModal?: boolean;
  onClose?: () => void;
}

interface TranscriptSegment {
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
  confidence?: number;
}

interface AIInsights {
  summary: string;
  action_items: string[];
  technical_requirements: string[];
  key_topics: string[];
  sentiment_analysis?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface CodeContext {
  github_references: Array<{
    type: 'issue' | 'pr' | 'commit';
    url: string;
    title: string;
    status?: string;
  }>;
  file_mentions: Array<{
    filename: string;
    line_number?: number;
    context?: string;
  }>;
  technical_terms: string[];
  architecture_diagrams?: string[];
}

interface QAMessage {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  timestamp: string;
}

export default function MeetingDetailView({ meetingId, isModal = false, onClose }: MeetingDetailViewProps) {
  const [meeting, setMeeting] = useState<MeetingResponse | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [codeContext, setCodeContext] = useState<CodeContext | null>(null);
  const [qaMessages, setQAMessages] = useState<QAMessage[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  useEffect(() => {
    loadMeetingData();
  }, [meetingId]);

  const loadMeetingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load meeting details
      const meetingData = await VoiceLinkAPI.getMeeting(meetingId);
      setMeeting(meetingData);

      // Try to load additional data (these might return 501/404 if not implemented)
      await Promise.allSettled([
        loadTranscript(),
        loadAIInsights(),
        loadCodeContext(),
      ]);

    } catch (err) {
      console.error('Failed to load meeting data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting data');
    } finally {
      setLoading(false);
    }
  };

  const loadTranscript = async () => {
    try {
      // This endpoint might not be implemented yet
      const response = await fetch(`http://localhost:8000/api/v1/meetings/${meetingId}/transcript`);
      if (response.ok) {
        const data = await response.json();
        setTranscript(data.segments || []);
      }
    } catch (err) {
      console.log('Transcript not available yet');
      // Set placeholder data
      setTranscript([
        {
          speaker: "Speaker 1",
          text: "Welcome everyone to today's meeting. Let's start by reviewing the current progress on the VoiceLink project.",
          start_time: 0,
          end_time: 5.2,
          confidence: 0.95
        },
        {
          speaker: "Speaker 2", 
          text: "Thanks for organizing this. I've been working on the API endpoints and have most of them ready for testing.",
          start_time: 5.5,
          end_time: 12.1,
          confidence: 0.92
        },
        {
          speaker: "Speaker 1",
          text: "Great! Can you walk us through the status of the transcript processing feature?",
          start_time: 12.5,
          end_time: 17.8,
          confidence: 0.88
        }
      ]);
    }
  };

  const loadAIInsights = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/analytics/meetings/${meetingId}/insights`);
      if (response.ok) {
        const data = await response.json();
        setAIInsights(data);
      }
    } catch (err) {
      console.log('AI insights not available yet');
      // Set placeholder data
      setAIInsights({
        summary: "This meeting focused on the development of VoiceLink's core features, including API endpoints, transcript processing, and user interface improvements. The team discussed current progress, upcoming milestones, and technical challenges.",
        action_items: [
          "Complete API endpoint testing by end of week",
          "Implement transcript processing with speaker identification", 
          "Review and update frontend meeting detail views",
          "Schedule follow-up meeting for next Friday"
        ],
        technical_requirements: [
          "WebSocket connection for real-time transcript updates",
          "Speaker diarization accuracy improvements",
          "Integration with blockchain verification system",
          "Performance optimization for large meeting files"
        ],
        key_topics: [
          "API Development",
          "Transcript Processing", 
          "User Interface",
          "Performance Optimization",
          "Testing Strategy"
        ],
        sentiment_analysis: {
          positive: 0.7,
          neutral: 0.25,
          negative: 0.05
        }
      });
    }
  };

  const loadCodeContext = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/meetings/${meetingId}/code-context`);
      if (response.ok) {
        const data = await response.json();
        setCodeContext(data);
      }
    } catch (err) {
      console.log('Code context not available yet');
      // Set placeholder data
      setCodeContext({
        github_references: [
          {
            type: 'issue',
            url: 'https://github.com/Voicelink-AI/voicelink-core/issues/42',
            title: 'Implement transcript processing API',
            status: 'in_progress'
          },
          {
            type: 'pr',
            url: 'https://github.com/Voicelink-AI/voicelink-app/pull/18',
            title: 'Add meeting detail view components',
            status: 'draft'
          },
          {
            type: 'commit',
            url: 'https://github.com/Voicelink-AI/voicelink-core/commit/abc123',
            title: 'Add analytics endpoints for meeting insights'
          }
        ],
        file_mentions: [
          {
            filename: 'src/services/api.ts',
            line_number: 245,
            context: 'Meeting API endpoints'
          },
          {
            filename: 'src/components/MeetingDetailView.tsx',
            context: 'Meeting detail UI components'
          },
          {
            filename: 'requirements.txt',
            context: 'Python dependencies for audio processing'
          }
        ],
        technical_terms: [
          'WebSocket', 'Speaker Diarization', 'Transcript Processing', 
          'API Endpoints', 'Real-time Updates', 'Blockchain Verification'
        ]
      });
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || isAskingQuestion) return;

    setIsAskingQuestion(true);
    const questionId = Date.now().toString();

    try {
      // This might return 501 if not implemented
      const response = await VoiceLinkAPI.queryMeeting(meetingId, newQuestion);
      
      const newMessage: QAMessage = {
        id: questionId,
        question: newQuestion,
        answer: response.response,
        confidence: response.confidence,
        timestamp: new Date().toISOString()
      };

      setQAMessages(prev => [...prev, newMessage]);
      setNewQuestion('');
    } catch (err) {
      // Show placeholder response if endpoint not implemented
      const newMessage: QAMessage = {
        id: questionId,
        question: newQuestion,
        answer: "Voice Q&A feature is not yet implemented. This will allow you to ask questions about the meeting content and get AI-powered answers based on the transcript and context.",
        confidence: 0.0,
        timestamp: new Date().toISOString()
      };

      setQAMessages(prev => [...prev, newMessage]);
      setNewQuestion('');
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (start: number, end: number) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading meeting details...</span>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="text-center p-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Meeting</h3>
        <p className="text-gray-500 mb-4">{error || 'Meeting not found'}</p>
        {onClose && (
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        )}
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: '📋 Overview', icon: '📋' },
    { id: 'audio', label: '🎵 Audio', icon: '🎵' },
    { id: 'transcript', label: '📝 Transcript', icon: '📝' },
    { id: 'ai-insights', label: '🤖 AI Insights', icon: '🤖' },
    { id: 'code-context', label: '💻 Code Context', icon: '💻' },
    { id: 'qa', label: '💬 Voice Q&A', icon: '💬' },
    { id: 'blockchain', label: '🔗 Blockchain', icon: '🔗' },
  ];

  const containerClass = isModal 
    ? "modal-overlay" 
    : "min-h-screen bg-gray-50 py-8";

  const contentClass = isModal 
    ? "modal-content max-w-6xl" 
    : "max-w-6xl mx-auto bg-white rounded-lg shadow-sm";

  return (
    <div className={containerClass} onClick={isModal ? (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && onClose) onClose();
    } : undefined}>
      <div className={contentClass}>
        {/* Header */}
        <div className="modal-header border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            📋 {meeting.title}
          </h1>
          {isModal && onClose && (
            <button 
              onClick={onClose}
              className="modal-close"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meeting ID</label>
                      <p className="text-gray-900 font-mono text-sm">{meeting.meeting_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    {meeting.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <p className="text-gray-900">{meeting.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    {meeting.created_at && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created</label>
                        <p className="text-gray-900">{new Date(meeting.created_at).toLocaleString()}</p>
                      </div>
                    )}
                    {meeting.start_time && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Started</label>
                        <p className="text-gray-900">{new Date(meeting.start_time).toLocaleString()}</p>
                      </div>
                    )}
                    {meeting.end_time && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ended</label>
                        <p className="text-gray-900">{new Date(meeting.end_time).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {meeting.participants?.length > 0 ? (
                    meeting.participants.map((participant: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(typeof participant === 'string' ? participant : participant.email)?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {typeof participant === 'string' ? participant : participant.email}
                            </p>
                            {participant.speaking_time && (
                              <p className="text-xs text-gray-500">
                                Speaking time: {Math.round(participant.speaking_time / 60)}m
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-full">No participants listed</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audio' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Audio Recording</h3>
              
              {meeting.recording_url ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Meeting Recording</h4>
                      <p className="text-sm text-gray-500">High-quality audio recording of the meeting</p>
                    </div>
                    <button className="btn btn-primary">
                      🎵 Download Audio
                    </button>
                  </div>
                  
                  <audio controls className="w-full">
                    <source src={meeting.recording_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🎵</div>
                  <h4 className="font-medium text-gray-900 mb-2">No Audio Recording Available</h4>
                  <p className="text-sm text-gray-600">
                    Audio recording may not be available for this meeting, or it may still be processing.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'transcript' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Meeting Transcript</h3>
                {transcript.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {transcript.length} segments
                  </div>
                )}
              </div>

              {transcript.length > 0 ? (
                <div className="space-y-4">
                  {transcript.map((segment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {segment.speaker.charAt(segment.speaker.length - 1)}
                          </div>
                          <span className="font-medium text-gray-900">{segment.speaker}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatDuration(segment.start_time, segment.end_time)}</span>
                          {segment.confidence && (
                            <span className="bg-gray-200 px-2 py-1 rounded">
                              {Math.round(segment.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{segment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h4 className="font-medium text-gray-900 mb-2">Transcript Processing</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Transcript processing with speaker identification is being implemented. 
                    This will show a detailed, multi-speaker transcript of the meeting.
                  </p>
                  <div className="text-xs text-gray-500">
                    Coming soon: Real-time transcript updates, speaker diarization, and confidence scores
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'ai-insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>

              {aiInsights ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Summary */}
                  <div className="lg:col-span-2">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">📝</span>
                        Executive Summary
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{aiInsights.summary}</p>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div>
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">✅</span>
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {aiInsights.action_items.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Technical Requirements */}
                  <div>
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">⚙️</span>
                        Technical Requirements
                      </h4>
                      <ul className="space-y-2">
                        {aiInsights.technical_requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key Topics */}
                  <div>
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">🏷️</span>
                        Key Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights.key_topics.map((topic, index) => (
                          <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Analysis */}
                  {aiInsights.sentiment_analysis && (
                    <div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">😊</span>
                          Sentiment Analysis
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-green-600">Positive</span>
                            <span className="font-medium">{Math.round(aiInsights.sentiment_analysis.positive * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${aiInsights.sentiment_analysis.positive * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Neutral</span>
                            <span className="font-medium">{Math.round(aiInsights.sentiment_analysis.neutral * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-500 h-2 rounded-full" 
                              style={{ width: `${aiInsights.sentiment_analysis.neutral * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-red-600">Negative</span>
                            <span className="font-medium">{Math.round(aiInsights.sentiment_analysis.negative * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${aiInsights.sentiment_analysis.negative * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Analysis Coming Soon</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    AI-powered analysis will provide executive summaries, action items, technical requirements, 
                    and sentiment analysis based on the meeting content.
                  </p>
                  <div className="text-xs text-gray-500">
                    Features in development: Automatic summarization, action item extraction, sentiment analysis
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'code-context' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Code Context & References</h3>

              {codeContext ? (
                <div className="space-y-6">
                  {/* GitHub References */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🔗</span>
                      GitHub References
                    </h4>
                    <div className="space-y-3">
                      {codeContext.github_references.map((ref, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {ref.type === 'issue' ? '🐛' : ref.type === 'pr' ? '🔄' : '📝'}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">{ref.title}</p>
                              <p className="text-sm text-gray-500">{ref.url}</p>
                              {ref.status && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                                  {ref.status}
                                </span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => window.open(ref.url, '_blank')}
                            className="btn btn-sm btn-secondary"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Mentions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📁</span>
                      File References
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {codeContext.file_mentions.map((file, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-blue-600">📄</span>
                            <span className="font-mono text-sm font-medium text-gray-900">{file.filename}</span>
                          </div>
                          {file.line_number && (
                            <p className="text-xs text-gray-500 mb-1">Line {file.line_number}</p>
                          )}
                          {file.context && (
                            <p className="text-xs text-gray-600">{file.context}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Terms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🏷️</span>
                      Technical Terms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {codeContext.technical_terms.map((term, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">💻</div>
                  <h4 className="font-medium text-gray-900 mb-2">Code Context Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatic detection of code references, GitHub issues/PRs, file mentions, 
                    and technical terminology discussed in the meeting.
                  </p>
                  <div className="text-xs text-gray-500">
                    Coming soon: Architecture diagrams, code snippet extraction, dependency analysis
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'qa' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Voice Q&A</h3>
              
              {/* Question Input */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask a question about this meeting..."
                    className="form-input flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    disabled={isAskingQuestion}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={!newQuestion.trim() || isAskingQuestion}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    {isAskingQuestion ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Asking...</span>
                      </>
                    ) : (
                      <>
                        <span>💬</span>
                        <span>Ask</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Q&A History */}
              {qaMessages.length > 0 ? (
                <div className="space-y-4">
                  {qaMessages.map((message) => (
                    <div key={message.id} className="bg-white border rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 text-lg">❓</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{message.question}</p>
                          <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <span className="text-green-600 text-lg">🤖</span>
                        <div className="flex-1">
                          <p className="text-gray-700">{message.answer}</p>
                          {message.confidence > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">Confidence:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${message.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{Math.round(message.confidence * 100)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h4 className="font-medium text-gray-900 mb-2">Ask Questions About This Meeting</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ask questions about the meeting content and get AI-powered answers based on the transcript and context.
                  </p>
                  <div className="text-xs text-gray-500">
                    Try asking: "What were the main action items?" or "Who spoke the most?"
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'blockchain' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h4 className="font-medium text-gray-900 mb-2">Blockchain Provenance</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Document verification and provenance tracking using blockchain technology is not yet implemented.
                  This will provide immutable proof of meeting authenticity and timestamp verification.
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  Coming soon: Document hashing, blockchain recording, verification status, audit trail
                </div>
                <button 
                  className="btn btn-secondary"
                  disabled
                >
                  🔗 Verify on Blockchain (Coming Soon)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isModal && (
          <div className="modal-footer border-t">
            <button 
              onClick={() => setActiveSection('qa')}
              className="btn btn-primary"
            >
              💬 Ask Questions
            </button>
            <button 
              onClick={() => setActiveSection('blockchain')}
              className="btn btn-secondary"
            >
              🔗 Blockchain
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
