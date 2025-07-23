import { useState, useEffect, useRef } from 'react';
import { VoiceLinkAPI, type MeetingResponse } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

interface LiveMeetingRoomProps {
  meetingId: string;
}

interface TranscriptSegment {
  id: string;
  speaker_id: string;
  content: string;
  timestamp: string;
  confidence: number;
}

export default function LiveMeetingRoom({ meetingId }: LiveMeetingRoomProps) {
  const [meeting, setMeeting] = useState<MeetingResponse | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    `ws://localhost:8000/api/v1/ws/meeting/${meetingId}`
  );

  useEffect(() => {
    loadMeetingData();
    const interval = setInterval(loadLiveTranscript, 3000); // Poll every 3 seconds
    
    return () => clearInterval(interval);
  }, [meetingId]);

  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  const loadMeetingData = async () => {
    try {
      const data = await VoiceLinkAPI.getMeeting(meetingId);
      setMeeting(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meeting');
    } finally {
      setLoading(false);
    }
  };

  const loadLiveTranscript = async () => {
    try {
      const data = await VoiceLinkAPI.getLiveTranscript(meetingId);
      if (data.transcript_segments && Array.isArray(data.transcript_segments)) {
        setTranscript(data.transcript_segments);
      } else {
        setTranscript([]);
      }
    } catch (err) {
      console.error('Failed to load live transcript:', err);
      setTranscript([]);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'transcript_update':
        setTranscript(prev => [...prev, message.content]);
        break;
      case 'speaker_joined':
        // Handle speaker joining
        break;
      case 'meeting_ended':
        setIsRecording(false);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioChunk(audioBlob);
      };

      mediaRecorderRef.current.start(5000); // Record in 5-second chunks
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudioChunk = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Send via WebSocket for real-time processing
        sendMessage({
          type: 'audio',
          content: base64Audio,
          speaker_id: 'current_user'
        });

        // Also send to API for processing
        await VoiceLinkAPI.processAudio(base64Audio);
      };
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      console.error('Failed to process audio chunk:', err);
    }
  };

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const uploadAudioFile = async (file: File) => {
    try {
      await VoiceLinkAPI.uploadAudio(file);
      await loadLiveTranscript(); // Refresh transcript
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload audio');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading meeting...</span>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting not found</h3>
        <p className="text-gray-500">The requested meeting could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{meeting.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <span>👥 {meeting.participants.length} participants</span>
              <span>Status: {meeting.status}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`btn ${isRecording ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript Panel */}
        <div className="flex-1 flex flex-col bg-white m-4 rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900">Live Transcript</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {transcript.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🎤</div>
                <p className="text-lg mb-2">No transcript available</p>
                <p className="text-sm">Start recording or upload an audio file to see the transcript here</p>
              </div>
            ) : (
              transcript.map((segment) => (
                <TranscriptSegment key={segment.id} segment={segment} />
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white m-4 ml-0 rounded-lg border border-gray-200 flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900">Controls</h2>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Audio Upload */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Audio File</h3>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAudioFile(file);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium text-red-800">Recording...</span>
                </div>
              </div>
            )}

            {/* Participants */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Participants</h3>
              <div className="space-y-2">
                {meeting.participants.length > 0 ? (
                  meeting.participants.map((participant, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {participant}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No participants listed</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TranscriptSegmentProps {
  segment: TranscriptSegment;
}

function TranscriptSegment({ segment }: TranscriptSegmentProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="border-l-4 border-blue-200 pl-4 py-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-900">{segment.speaker_id}</span>
        <span className="text-xs text-gray-500">{formatTime(segment.timestamp)}</span>
        <span className={`text-xs ${getConfidenceColor(segment.confidence)}`}>
          {Math.round(segment.confidence * 100)}%
        </span>
      </div>
      <p className="text-gray-800">{segment.content}</p>
    </div>
  );
}
