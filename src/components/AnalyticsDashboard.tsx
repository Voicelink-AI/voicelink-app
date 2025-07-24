import { useState, useEffect } from 'react';
import { VoiceLinkAPI, type AnalyticsResponse } from '../services/api';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await VoiceLinkAPI.getAnalyticsOverview();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      // Set empty analytics if API fails
      setAnalytics({
        total_meetings: 0,
        total_participants: 0,
        total_speaking_time: 0,
        active_meetings: 0,
        total_minutes_recorded: 0,
        avg_meeting_duration: 0,
        top_speakers: [],
        sentiment_analysis: { positive: 0, negative: 0, neutral: 0 },
        word_cloud_data: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await VoiceLinkAPI.exportAnalytics(exportFormat);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voicelink-analytics.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export analytics');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">❌</div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no real data exists
  const hasNoData = !analytics || analytics.total_meetings === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        
        <div className="flex items-center gap-3">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json' | 'pdf')}
            className="form-select"
            disabled={hasNoData}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
          </select>
          
          <button
            onClick={handleExport}
            disabled={isExporting || hasNoData}
            className="btn btn-primary"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Exporting...
              </>
            ) : (
              <>📊 Export {exportFormat.toUpperCase()}</>
            )}
          </button>
          
          <button onClick={loadAnalytics} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-yellow-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
              <p className="mt-1 text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats - Always show zeros for now */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-value">0</p>
          <p className="stat-label">Total Meetings</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">0</p>
          <p className="stat-label">Total Participants</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">0h</p>
          <p className="stat-label">Speaking Time</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">0</p>
          <p className="stat-label">Active Meetings</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Meeting Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>No data available</p>
              <p className="text-sm">Start creating meetings to see trends</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Participation Analysis</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <p>No data available</p>
              <p className="text-sm">Create meetings to analyze participation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Duration Distribution</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">⏱️</div>
              <p>No data available</p>
              <p className="text-sm">Upload audio files to see duration analysis</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Activity</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <p>No data available</p>
              <p className="text-sm">Activity will appear as you use VoiceLink</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state message */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Yet</h3>
          <p className="text-sm">Once you start creating meetings and uploading audio files, detailed analytics will appear here</p>
        </div>
      </div>
    </div>
  );
}
