import { useState, useEffect } from 'react';
import { VoiceLinkAPI, type AnalyticsResponse } from '../services/api';
import AudioUploader from './AudioUploader';
import ChatInterface from './ChatInterface';

interface DashboardProps {
  onNavigateToMeeting?: (meetingId: string) => void;
  onNavigateToMeetings?: () => void;
  onNavigateToChat?: (meetingId: string) => void;
}

export default function Dashboard({
  onNavigateToMeeting,
  onNavigateToMeetings,
  onNavigateToChat
}: DashboardProps = {}) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMeetingId, setRecentMeetingId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const analyticsData = await VoiceLinkAPI.getAnalyticsOverview();
      setAnalytics(analyticsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      // Set empty analytics with correct structure if API fails
      setAnalytics({
        total_meetings: 0,
        total_participants: 0,
        total_minutes_recorded: 0,
        total_speaking_time: 0,
        avg_meeting_duration: 0,
        active_meetings: 0,
        top_speakers: [],
        sentiment_analysis: {},
        word_cloud_data: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, meetingId?: string) => {
    try {
      console.log('📁 File uploaded:', file.name);
      if (meetingId) {
        console.log('📋 Meeting created:', meetingId);
        setRecentMeetingId(meetingId);
      }
      
      // Refresh analytics after upload and meeting creation
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to handle file upload:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to VoiceLink 🎙️
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform your audio meetings into structured, actionable, and interactive documentation 
          with AI-powered voice interfaces, code context awareness, and blockchain verification.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-400">❌</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Dashboard Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button 
                onClick={loadDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show recent meeting notification */}
      {recentMeetingId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-blue-400 text-lg mr-3">🎉</div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Meeting Created!</h3>
                <p className="text-sm text-blue-700">Your audio has been uploaded and a meeting record created.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToMeeting?.(recentMeetingId!)}
                className="btn btn-primary text-xs"
              >
                View Meeting
              </button>
              <button
                onClick={() => setRecentMeetingId(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      {loading ? (
        <div className="dashboard-stats">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : analytics ? (
        <div className="dashboard-stats">
          <div className="stat-card">
            <p className="stat-value">{analytics.total_meetings}</p>
            <p className="stat-label">Total Meetings</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{analytics.total_participants}</p>
            <p className="stat-label">Total Participants</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{Math.round(((analytics.total_minutes_recorded || analytics.total_speaking_time) || 0) / 60) || 0}h</p>
            <p className="stat-label">Speaking Time</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{analytics.active_meetings || 0}</p>
            <p className="stat-label">Active Meetings</p>
          </div>
        </div>
      ) : null}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload */}
        <div className="lg:col-span-2">
          <AudioUploader 
            onFileUpload={handleFileUpload}
            onNavigateToMeeting={onNavigateToMeeting}
            onNavigateToMeetings={onNavigateToMeetings}
            onNavigateToChat={onNavigateToChat}
          />
          
          {/* Updated Instructions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How VoiceLink Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📤</div>
                <div>
                  <h4 className="font-medium text-gray-900">Upload Audio</h4>
                  <p className="text-sm text-gray-600">Drag and drop or select an audio file to start</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📋</div>
                <div>
                  <h4 className="font-medium text-gray-900">Auto-Create Meeting</h4>
                  <p className="text-sm text-gray-600">VoiceLink automatically creates a meeting record for your audio</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Processing</h4>
                  <p className="text-sm text-gray-600">Audio is transcribed and analyzed (when processing is enabled)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <h4 className="font-medium text-gray-900">Interactive Chat</h4>
                  <p className="text-sm text-gray-600">Ask questions about your meeting content using AI</p>
                </div>
              </div>
            </div>
            
            {recentMeetingId && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-green-600 font-medium">
                  ✅ Your latest meeting is ready! Use the chat to ask questions about your audio.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Chat with meeting context */}
        <div className="space-y-6">
          <ChatInterface meetingId={recentMeetingId || undefined} />
          
          {/* System Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Meetings</span>
                <span className="text-gray-900">{analytics?.total_meetings || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Speaking Time</span>
                <span className="text-gray-900">
                  {analytics ? (Math.round(((analytics.total_minutes_recorded || analytics.total_speaking_time) || 0) / 60) || 0) : 0}h
                </span>
              </div>
              {recentMeetingId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Latest Meeting</span>
                  <span className="text-blue-600 text-xs font-mono">{recentMeetingId.slice(-8)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          VoiceLink Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Voice Processing
            </h3>
            <p className="text-sm text-gray-600">
              Advanced audio transcription with speaker detection
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Intelligent content analysis and documentation generation
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interactive Chat
            </h3>
            <p className="text-sm text-gray-600">
              Ask questions about your content with AI assistance
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Blockchain Verified
            </h3>
            <p className="text-sm text-gray-600">
              Cryptographic verification and secure content storage
            </p>
          </div>
        </div>
      </div>
  </div>
  );
}
