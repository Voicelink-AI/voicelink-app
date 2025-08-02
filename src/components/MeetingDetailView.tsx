import React, { useState, useEffect, useRef } from 'react';
import { VoiceLinkAPI, type MeetingAnalytics } from '../services/api';
import { processMeetingAudio } from "../utils/meetingApi";
import type { Meeting } from '../types';

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

// Audio Player Component
const AudioPlayer: React.FC<{ audioUrl: string; onTimeUpdate?: (time: number) => void }> = ({ 
  audioUrl, 
  onTimeUpdate 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4.03L12 18V6L7.03 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const vol = parseFloat(e.target.value);
              setVolume(vol);
              if (audioRef.current) audioRef.current.volume = vol;
            }}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoading(false);
            setHasError(false);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio loading error:', e);
          setHasError(true);
          setIsLoading(false);
          setErrorMessage('Failed to load audio. Please check if the backend routing is working.');
        }}
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
        }}
      />
      
      {/* Loading/Error States */}
      {isLoading && (
        <div className="text-sm text-gray-500 mt-2">
          🔄 Loading audio...
        </div>
      )}
      {hasError && (
        <div className="text-sm text-red-500 mt-2">
          ⚠️ {errorMessage}
          <br />
          <span className="text-xs text-gray-500">URL: {audioUrl}</span>
        </div>
      )}
    </div>
  );
};

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
  console.log('MeetingDetailView: Rendering with meetingId:', meetingId);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [codeContext, setCodeContext] = useState<CodeContext | null>(null);
  const [qaMessages, setQAMessages] = useState<QAMessage[]>([]);
  const [analytics, setAnalytics] = useState<MeetingAnalytics | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'audio', label: 'Audio' },
    { id: 'transcript', label: 'Transcript' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'AI Insights' },
    { id: 'qa', label: 'Q&A' }
  ];

  useEffect(() => {
    loadMeetingData();
  }, [meetingId]);

  // Real-time analytics updates
  useEffect(() => {
    if (!analytics || activeSection !== 'analytics') return;

    let eventSource: EventSource | null = null;
    let pollInterval: number | null = null;

    // Try EventSource first, fallback to polling
    try {
      eventSource = new EventSource(`http://localhost:8000/api/v1/analytics/meetings/${meetingId}/realtime`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setAnalytics(data);
        } catch (err) {
          console.error('Failed to parse real-time analytics:', err);
        }
      };

      eventSource.onerror = () => {
        console.log('EventSource failed, falling back to polling');
        eventSource?.close();
        
        // Fallback to polling every 30 seconds
        pollInterval = setInterval(async () => {
          try {
            const data = await VoiceLinkAPI.getMeetingAnalytics(meetingId);
            setAnalytics(data);
          } catch (err) {
            console.error('Failed to poll analytics:', err);
          }
        }, 30000);
      };
    } catch (err) {
      console.log('EventSource not supported, using polling');
      
      // Fallback to polling every 30 seconds
      pollInterval = setInterval(async () => {
        try {
          const data = await VoiceLinkAPI.getMeetingAnalytics(meetingId);
          setAnalytics(data);
        } catch (err) {
          console.error('Failed to poll analytics:', err);
        }
      }, 30000);
    }

    return () => {
      eventSource?.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [meetingId, analytics, activeSection]);

  const loadTranscript = async () => {
    try {
      console.log('MeetingDetailView: Loading transcript for meeting:', meetingId);
      const transcriptData = await VoiceLinkAPI.getTranscript(meetingId);
      console.log('MeetingDetailView: Received transcript data:', transcriptData);
      
      // Handle the new structured response format from your backend
      if (transcriptData && transcriptData.transcript && transcriptData.transcript.segments) {
        const segments: TranscriptSegment[] = transcriptData.transcript.segments.map((seg: any) => ({
          speaker: seg.speaker_id || 'Unknown Speaker',
          text: seg.text || '',
          start_time: seg.start_time || 0,
          end_time: seg.end_time || (seg.start_time + seg.duration) || 5,
          confidence: seg.confidence || 0.95,
        }));
        setTranscript(segments);
        console.log('MeetingDetailView: Successfully loaded', segments.length, 'transcript segments');
      } else if (transcriptData && transcriptData.segments) {
        // Handle direct segments format (fallback)
        const segments: TranscriptSegment[] = transcriptData.segments.map((seg: any) => ({
          speaker: seg.speaker || seg.speaker_id || 'Unknown Speaker',
          text: seg.text || seg.content || '',
          start_time: seg.start_time || parseTimestamp(seg.timestamp) || 0,
          end_time: seg.end_time || (seg.start_time ? seg.start_time + 5 : parseTimestamp(seg.timestamp) + 5) || 5,
          confidence: seg.confidence || 0.95,
        }));
        setTranscript(segments);
      } else if (transcriptData && transcriptData.speakers) {
        // Handle speakers-based format (alternative fallback)
        const segments: TranscriptSegment[] = [];
        transcriptData.speakers.forEach((speaker: any) => {
          if (Array.isArray(speaker.segments)) {
            speaker.segments.forEach((seg: any) => {
              segments.push({
                speaker: speaker.speaker_id,
                text: seg.text,
                start_time: seg.timestamp ? parseTimestamp(seg.timestamp) : 0,
                end_time: seg.timestamp ? parseTimestamp(seg.timestamp) + (seg.duration || 5) : 5,
                confidence: seg.confidence || 0.95,
              });
            });
          }
        });
        setTranscript(segments);
      } else {
        console.log('MeetingDetailView: No transcript data found in response');
        setTranscript([]);
      }
    } catch (err) {
      console.error('MeetingDetailView: Failed to load transcript from dedicated endpoint:', err);
      // Fallback: try to get transcript from main meeting data
      console.log('MeetingDetailView: Trying fallback - loading transcript from meeting data');
      try {
        const meetingResponse = await fetch(`http://localhost:8000/api/v1/meetings/${meetingId}`);
        if (meetingResponse.ok) {
          const meetingData = await meetingResponse.json();
          if (meetingData.transcript && meetingData.speakers) {
            const segments: TranscriptSegment[] = [];
            meetingData.speakers.forEach((speaker: any) => {
              if (Array.isArray(speaker.segments)) {
                speaker.segments.forEach((seg: any) => {
                  segments.push({
                    speaker: speaker.speaker_id,
                    text: seg.text,
                    start_time: seg.timestamp ? parseTimestamp(seg.timestamp) : 0,
                    end_time: seg.timestamp ? parseTimestamp(seg.timestamp) + 5 : 5,
                    confidence: seg.confidence || 0.95,
                  });
                });
              }
            });
            setTranscript(segments);
            console.log('MeetingDetailView: Successfully loaded transcript from fallback');
          } else {
            setTranscript([]);
          }
        } else {
          setTranscript([]);
        }
      } catch (fallbackErr) {
        console.error('MeetingDetailView: Fallback transcript loading also failed:', fallbackErr);
        setTranscript([]);
      }
    }
  };

  const loadMeetingData = async () => {
    console.log('MeetingDetailView: Loading meeting data for:', meetingId);
    try {
      setLoading(true);
      setError(null);

      // Load meeting details from your backend
      const response = await fetch(`http://localhost:8000/api/v1/meetings/${meetingId}`);
      if (!response.ok) {
        throw new Error('Meeting not found');
      }
      const meetingData = await response.json();
      console.log('MeetingDetailView: Received meeting data:', meetingData);
      setMeeting(meetingData);

      // Set audio URL if available - use the correct backend endpoint
      if (meetingData.audio_url) {
        // If audio_url is already a full URL, use it as is
        if (meetingData.audio_url.startsWith('http')) {
          setAudioUrl(meetingData.audio_url);
        } else {
          // Otherwise, construct the correct API endpoint
          setAudioUrl(`http://localhost:8000/api/v1/files/${meetingId}`);
        }
      } else {
        // Fallback: try the files endpoint even if no audio_url in response
        setAudioUrl(`http://localhost:8000/api/v1/files/${meetingId}`);
      }

      // Load transcript from dedicated endpoint
      await Promise.allSettled([
        loadTranscript(),
        //loadAIInsights(),
        //loadCodeContext(),
        //loadAnalytics(),
      ]);

    } catch (err) {
      console.error('MeetingDetailView: Failed to load meeting data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting data');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedAudioUrl(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    try {
      const result = await processMeetingAudio(file);
      const segments: TranscriptSegment[] = [];
      result.speakers.forEach((speaker: any) => {
        speaker.segments.forEach((seg: any) => {
          segments.push({
            speaker: speaker.speaker_id,
            text: seg.text,
            start_time: seg.timestamp ? parseTimestamp(seg.timestamp) : 0,
            end_time: seg.timestamp ? parseTimestamp(seg.timestamp) + 5 : 0,
            confidence: seg.confidence,
          });
        });
      });
      setTranscript(segments);
      setAudioUrl(URL.createObjectURL(file));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function parseTimestamp(ts: string): number {
    const parts = ts.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  const containerClass = isModal 
    ? "" 
    : "min-h-screen bg-gray-50 py-8";

  const contentClass = isModal 
    ? "" 
    : "max-w-6xl mx-auto bg-white rounded-lg shadow-sm";

  function formatDuration(start_time: number, end_time: number): string {
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return `${formatTime(start_time)} - ${formatTime(end_time)}`;
  }

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Header - only show if not in modal */}
        {!isModal && (
          <div className="border-b p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              📋 {meeting?.title || 'Meeting Details'}
            </h1>
          </div>
        )}

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
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Overview</h3>
              
              {/* Meeting Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">📋 Meeting Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        meeting?.status === 'completed' ? 'text-green-600' : 
                        meeting?.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {meeting?.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {meeting?.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">
                        {meeting?.duration ? `${Math.floor(meeting.duration / 60)} minutes` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">👥 Participants</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Count:</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {meeting?.participants_count || meeting?.participants?.length || 0}
                      </span>
                    </div>
                    {meeting?.participants && meeting.participants.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Speakers:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {meeting.participants.slice(0, 3).map((participant, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {participant}
                            </span>
                          ))}
                          {meeting.participants.length > 3 && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              +{meeting.participants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analytics Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">📊 Analytics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">
                        {analytics?.duration_minutes ? 
                          `${analytics.duration_minutes}m` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Topics:</span>
                      <span className="text-gray-900">
                        {analytics?.topics_discussed?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Action Items:</span>
                      <span className="text-gray-900">
                        {analytics?.action_items?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Summary */}
              {transcript && transcript.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">📝 Quick Summary</h4>
                  <p className="text-sm text-gray-600">
                    Meeting with {meeting?.participants_count || 'unknown'} participants. 
                    Total transcript segments: {transcript.length}.
                  </p>
                </div>
              )}

              {/* Action Items & Key Points */}
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Action Items */}
                  {analytics.action_items && analytics.action_items.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">✅ Action Items</h4>
                      <ul className="space-y-1">
                        {analytics.action_items.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {item.action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Topics */}
                  {analytics.topics_discussed && analytics.topics_discussed.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">🔑 Key Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {analytics.topics_discussed.slice(0, 6).map((topic, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {topic.topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Audio Section */}
          {activeSection === 'audio' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Audio Recording</h3>
              
              {/* Audio upload and reprocess */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload new audio (.wav) to process meeting:
                </label>
                <input
                  type="file"
                  accept="audio/wav"
                  onChange={handleAudioUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
              </div>

              {(uploadedAudioUrl || audioUrl) ? (
                <div className="space-y-4">
                  <AudioPlayer 
                    audioUrl={uploadedAudioUrl || audioUrl!} 
                    onTimeUpdate={setCurrentAudioTime}
                  />
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🎵</div>
                  <h4 className="font-medium text-gray-900 mb-2">No Audio Recording Available</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload an audio file to process this meeting or check if the backend audio serving is working.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Expected audio endpoint: <code className="bg-gray-100 px-1 rounded">GET /api/v1/files/{meetingId}</code></p>
                    <p>Current meeting ID: <code className="bg-gray-100 px-1 rounded">{meetingId}</code></p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Audio recording may not be available for this meeting, or it may still be processing.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Transcript Section */}
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
                    <div 
                      key={index} 
                      className={`bg-gray-50 rounded-lg p-4 transition-colors ${
                        currentAudioTime >= segment.start_time && currentAudioTime <= segment.end_time 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {segment.speaker.charAt(segment.speaker.length - 1)}
                          </div>
                          <span className="font-medium text-gray-900">{segment.speaker}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <button
                            onClick={() => {
                              if (audioUrl || uploadedAudioUrl) {
                                const audioElement = document.querySelector('audio');
                                if (audioElement) {
                                  audioElement.currentTime = segment.start_time;
                                }
                              }
                            }}
                            className="hover:text-blue-600 cursor-pointer"
                          >
                            🕐 {formatDuration(segment.start_time, segment.end_time)}
                          </button>
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
                  <h4 className="font-medium text-gray-900 mb-2">No Transcript Available</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    The transcript for this meeting is not available or may still be processing.
                  </p>
                  <div className="text-xs text-gray-500">
                    Upload a new audio file above to generate a transcript.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
