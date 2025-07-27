import { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter
} from 'recharts';
import { format, subDays } from 'date-fns';
import { VoiceLinkAPI, type DetailedAnalyticsResponse } from '../services/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  project: string;
  timeframe: '7d' | '30d' | '90d' | 'custom';
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<DetailedAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    },
    project: '',
    timeframe: '30d'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'participation' | 'topics' | 'actions' | 'code'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [filters.dateRange, filters.project]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await VoiceLinkAPI.getDetailedAnalytics({
        start_date: filters.dateRange.start,
        end_date: filters.dateRange.end,
        project: filters.project || undefined
      });
      
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      // Don't set mock data - let the component show the error state
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (timeframe: FilterState['timeframe']) => {
    const now = new Date();
    let start: Date;
    
    switch (timeframe) {
      case '7d':
        start = subDays(now, 7);
        break;
      case '30d':
        start = subDays(now, 30);
        break;
      case '90d':
        start = subDays(now, 90);
        break;
      default:
        return; // custom - don't change dates
    }
    
    setFilters(prev => ({
      ...prev,
      timeframe,
      dateRange: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(now, 'yyyy-MM-dd')
      }
    }));
  };

  const exportData = async (fileFormat: 'csv' | 'json' | 'pdf') => {
    try {
      const blob = await VoiceLinkAPI.exportAnalytics(fileFormat);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${fileFormat}-${format(new Date(), 'yyyy-MM-dd')}.${fileFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-400 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="text-lg font-medium text-red-800">Analytics Unavailable</h3>
            <p className="text-red-600 mt-1">{error}</p>
            {error.includes('backend server') && (
              <p className="text-red-500 mt-2 text-sm">
                To view analytics data, start the VoiceLink backend server on <code className="bg-red-100 px-1 rounded">localhost:8000</code>
              </p>
            )}
            <button onClick={loadAnalytics} className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your VoiceLink meetings</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select 
              value={filters.timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value as FilterState['timeframe'])}
              className="form-select text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {filters.timeframe === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="form-input text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="form-input text-sm"
              />
            </div>
          )}

          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Project:</label>
            <input
              type="text"
              placeholder="All projects"
              value={filters.project}
              onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
              className="form-input text-sm w-32"
            />
          </div>

          {/* Export */}
          <div className="flex items-center gap-1">
            <button onClick={() => exportData('csv')} className="btn btn-secondary text-sm">
              📊 CSV
            </button>
            <button onClick={() => exportData('json')} className="btn btn-secondary text-sm">
              📄 JSON
            </button>
            <button onClick={() => exportData('pdf')} className="btn btn-secondary text-sm">
              📋 PDF
            </button>
          </div>

          <button onClick={loadAnalytics} className="btn btn-primary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.total_meetings)}</p>
              <p className="text-sm text-gray-600">Total Meetings</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.total_participants)}</p>
              <p className="text-sm text-gray-600">Total Participants</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatDuration(analytics.overview.total_speaking_time)}</p>
              <p className="text-sm text-gray-600">Speaking Time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatDuration(analytics.overview.avg_meeting_duration)}</p>
              <p className="text-sm text-gray-600">Avg Duration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'trends', label: 'Trends', icon: '📈' },
              { id: 'participation', label: 'Participation', icon: '👥' },
              { id: 'topics', label: 'Topics', icon: '🏷️' },
              { id: 'actions', label: 'Action Items', icon: '✅' },
              { id: 'code', label: 'Code Context', icon: '💻' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Meeting Trends Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Trends (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.meeting_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => format(new Date(date as string), 'MMM dd, yyyy')}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="meetings_count" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Meetings"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="participants_count" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Participants"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Duration Distribution */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Duration Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.duration_distribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ range, count }) => `${range}: ${count}`}
                    >
                      {analytics.duration_distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analytics.weekly_activity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="meetings" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      name="Meetings"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hours" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981"
                      name="Hours"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Participation Tab */}
          {activeTab === 'participation' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Participants</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.participation_stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="participant" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="speaking_time" fill="#3B82F6" name="Speaking Time (min)" />
                    <Bar dataKey="engagement_score" fill="#10B981" name="Engagement Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.participation_stats.map((participant, index) => (
                  <div key={participant.participant} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {participant.participant.split('@')[0]}
                      </span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>💬 {participant.speaking_time}min speaking</div>
                      <div>📅 {participant.meetings_attended} meetings</div>
                      <div>⭐ {participant.engagement_score}% engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics Tab */}
          {activeTab === 'topics' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={analytics.topics_analysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="frequency" name="Frequency" />
                    <YAxis dataKey="sentiment" name="Sentiment" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Topics" data={analytics.topics_analysis} fill="#3B82F6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.topics_analysis.map((topic) => (
                  <div key={topic.topic} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                      <span className="text-sm text-gray-500">{topic.frequency} mentions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Sentiment:</span>
                        <div className={`w-3 h-3 rounded-full ${
                          topic.sentiment > 0.7 ? 'bg-green-500' :
                          topic.sentiment > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm text-gray-600 ml-2">
                          {(topic.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {topic.meetings.length} meetings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Action Items Overview</h3>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Pending: {analytics.action_items.filter(a => a.status === 'pending').length}
                  </span>
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    In Progress: {analytics.action_items.filter(a => a.status === 'in_progress').length}
                  </span>
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Completed: {analytics.action_items.filter(a => a.status === 'completed').length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {analytics.action_items.map((action, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            action.status === 'completed' ? 'bg-green-500' :
                            action.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">{action.action}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👤 {action.assignee || 'Unassigned'}</span>
                          <span>📋 {action.meeting_id}</span>
                          <span>📅 {format(new Date(action.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        action.status === 'completed' ? 'bg-green-100 text-green-800' :
                        action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {action.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Context Tab */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Programming Languages Discussed</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.code_context}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="language" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#3B82F6" name="Frequency" />
                    <Bar dataKey="lines_discussed" fill="#10B981" name="Lines Discussed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.code_context.map((lang) => (
                  <div key={lang.language} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{lang.language}</h4>
                      <span className="text-sm text-gray-500">{lang.frequency}%</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Complexity:</span>
                        <span className="font-medium">{lang.complexity_score}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lines:</span>
                        <span className="font-medium">{formatNumber(lang.lines_discussed)}</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(lang.complexity_score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
