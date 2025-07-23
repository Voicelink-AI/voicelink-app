import { useState, useEffect } from 'react';
import { VoiceLinkAPI, type AnalyticsResponse } from '../services/api';
import AudioUploader from './AudioUploader';
import ChatInterface from './ChatInterface';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      // Set empty analytics if API fails
      setAnalytics({
        total_meetings: 0,
        total_participants: 0,
        total_speaking_time: 0,
        active_meetings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await VoiceLinkAPI.uploadAudio(file);
      // Refresh analytics after upload
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to upload audio:', err);
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

      {/* Overview Stats - Show zeros if no real data */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-value">{analytics?.total_meetings || 0}</p>
          <p className="stat-label">Total Meetings</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{analytics?.total_participants || 0}</p>
          <p className="stat-label">Total Participants</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{analytics ? Math.round(analytics.total_speaking_time / 60) : 0}h</p>
          <p className="stat-label">Speaking Time</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{analytics?.active_meetings || 0}</p>
          <p className="stat-label">Active Meetings</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload */}
        <div className="lg:col-span-2">
          <AudioUploader onFileUpload={handleFileUpload} />
          
          {/* Instructions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">1️⃣</div>
                <div>
                  <h4 className="font-medium text-gray-900">Upload Audio</h4>
                  <p className="text-sm text-gray-600">Upload an audio file above to begin transcription</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">2️⃣</div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Processing</h4>
                  <p className="text-sm text-gray-600">Your audio will be processed and analyzed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">3️⃣</div>
                <div>
                  <h4 className="font-medium text-gray-900">Interactive Q&A</h4>
                  <p className="text-sm text-gray-600">Ask questions about your content using the chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Chat */}
        <div className="space-y-6">
          <ChatInterface />
          
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
                <span className="text-gray-900">{analytics ? Math.round(analytics.total_speaking_time / 60) : 0}h</span>
              </div>
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
