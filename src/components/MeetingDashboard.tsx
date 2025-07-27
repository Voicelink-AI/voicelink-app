import { useState, useEffect } from 'react';
import { VoiceLinkAPI, type MeetingResponse, type MeetingCreateRequest } from '../services/api';
import type { Meeting } from '../types';
import CreateMeetingModal from './CreateMeetingModal';
import MeetingDetailsModal from './MeetingDetailsModal';

interface MeetingDashboardProps {
  onSelectMeeting?: (meetingId: string) => void;
  onNavigateToMeeting?: (meetingId: string) => void;
  onNavigateToChat?: (meetingId: string) => void;
}

export default function MeetingDashboard({ 
  onSelectMeeting, 
  onNavigateToMeeting, 
  onNavigateToChat 
}: MeetingDashboardProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, [filter]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await VoiceLinkAPI.getMeetings(filter || undefined);
      
      // Transform MeetingResponse[] to Meeting[]
      const transformedMeetings: Meeting[] = data.map((meetingResponse: MeetingResponse) => ({
        id: meetingResponse.meeting_id,
        title: meetingResponse.title,
        duration: 0, // Will be updated when audio info is available
        participants: meetingResponse.participants?.map(p => typeof p === 'string' ? p : p.email || 'Unknown') || [],
        participants_count: meetingResponse.participants?.length || 0,
        status: meetingResponse.status,
        createdAt: meetingResponse.created_at || new Date().toISOString(),
        audioFileName: meetingResponse.recording_url,
        // Enhanced fields will be populated by individual meeting calls if needed
        audio_info: undefined,
        analytics: undefined,
        processing_info: undefined,
      }));
      
      setMeetings(transformedMeetings);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meetings');
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (meetingData: MeetingCreateRequest) => {
    try {
      await VoiceLinkAPI.createMeeting(meetingData);
      await loadMeetings();
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting');
      console.error('Failed to create meeting:', err);
      throw err; // Re-throw to let modal handle the error
    }
  };

  const handleStartMeeting = async (meetingId: string) => {
    try {
      console.log('🚀 Starting meeting:', meetingId);
      await VoiceLinkAPI.startMeeting(meetingId);
      await loadMeetings();
      console.log('✅ Meeting started successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start meeting';
      setError(errorMessage);
      console.error('Failed to start meeting:', err);

      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setError('Meeting start functionality is not yet implemented in the backend');
      }
    }
  };

  const handleEndMeeting = async (meetingId: string) => {
    try {
      console.log('⏹️ Ending meeting:', meetingId);
      await VoiceLinkAPI.endMeeting(meetingId);
      await loadMeetings();
      console.log('✅ Meeting ended successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end meeting';
      setError(errorMessage);
      console.error('Failed to end meeting:', err);

      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setError('Meeting end functionality is not yet implemented in the backend');
      }
    }
  };

  const handlePauseMeeting = async (meetingId: string) => {
    try {
      console.log('⏸️ Pausing meeting:', meetingId);
      await VoiceLinkAPI.pauseMeeting(meetingId);
      await loadMeetings();
      console.log('✅ Meeting paused successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause meeting';
      setError(errorMessage);
      console.error('Failed to pause meeting:', err);
    }
  };

  const handleResumeMeeting = async (meetingId: string) => {
    try {
      console.log('▶️ Resuming meeting:', meetingId);
      await VoiceLinkAPI.resumeMeeting(meetingId);
      await loadMeetings();
      console.log('✅ Meeting resumed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume meeting';
      setError(errorMessage);
      console.error('Failed to resume meeting:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading meetings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Meetings</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          📅 Create Meeting
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-400">❌</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-select"
        >
          <option value="">All Meetings</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <button
          onClick={loadMeetings}
          className="btn btn-secondary"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Meetings Grid */}
      {meetings.length > 0 ? (
        <div className="meetings-grid">
          {meetings.map((meeting, index) => (
            <MeetingCard
              key={meeting.id || index}
              meeting={meeting}
              onStart={() => handleStartMeeting(meeting.id)}
              onEnd={() => handleEndMeeting(meeting.id)}
              onPause={() => handlePauseMeeting(meeting.id)}
              onResume={() => handleResumeMeeting(meeting.id)}
              onSelectMeeting={onSelectMeeting}
              onNavigateToMeeting={onNavigateToMeeting}
              onNavigateToChat={onNavigateToChat}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
          <p className="text-gray-500 mb-4">
            {filter ? `No ${filter} meetings found` : 'Create your first meeting to get started'}
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create First Meeting
          </button>
        </div>
      )}

      {/* Create Meeting Modal */}
      {showCreateForm && (
        <CreateMeetingModal
          onSubmit={handleCreateMeeting}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

interface MeetingCardProps {
  meeting: Meeting;
  onStart: () => void;
  onEnd: () => void;
  onPause: () => void;
  onResume: () => void;
  onSelectMeeting?: (meetingId: string) => void;
  onNavigateToMeeting?: (meetingId: string) => void;
  onNavigateToChat?: (meetingId: string) => void;
}

function MeetingCard({ meeting, onStart, onEnd, onPause, onResume, onSelectMeeting, onNavigateToMeeting, onNavigateToChat }: MeetingCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async () => {
    try {
      setLoadingDetails(true);
      const details = await VoiceLinkAPI.getMeetingWithEnhancedData(meeting.id);
      setMeetingDetails(details);
      setShowDetails(true);
    } catch (error) {
      console.error('Failed to load meeting details:', error);
      setMeetingDetails(meeting);
      setShowDetails(true);
    } finally {
      setLoadingDetails(false);
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

  const getActionButtons = () => {
    switch (meeting.status) {
      case 'scheduled':
        return (
          <button onClick={onStart} className="btn btn-primary">
            ▶️ Start Meeting
          </button>
        );
      case 'active':
        return (
          <>
            <button onClick={onPause} className="btn btn-secondary">
              ⏸️ Pause
            </button>
            <button onClick={onEnd} className="btn btn-secondary">
              ⏹️ End Meeting
            </button>
          </>
        );
      case 'paused':
        return (
          <>
            <button onClick={onResume} className="btn btn-primary">
              ▶️ Resume
            </button>
            <button onClick={onEnd} className="btn btn-secondary">
              ⏹️ End Meeting
            </button>
          </>
        );
      case 'completed':
        return (
          <div className="text-sm text-gray-500">Meeting completed</div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="meeting-card">
        <div className="meeting-header">
          <h3 className="meeting-title">{meeting.title}</h3>
          <span className={`status-badge ${getStatusColor(meeting.status)}`}>
            {meeting.status}
          </span>
        </div>

        <div className="meeting-meta">
          <p className="meta-item">
            👥 {meeting.participants_count} participants
          </p>
          <p className="meta-item">
            📅 {new Date(meeting.createdAt).toLocaleDateString()}
          </p>
          {meeting.duration > 0 && (
            <p className="meta-item">
              ⏱️ {Math.floor(meeting.duration / 60)} min
            </p>
          )}
        </div>

        <div className="meeting-actions">
          {getActionButtons()}
          
          <button 
            onClick={handleViewDetails}
            disabled={loadingDetails}
            className="btn btn-secondary"
          >
            {loadingDetails ? '⏳' : '👁️'} View Details
          </button>
          
          {onSelectMeeting && (
            <button 
              onClick={() => {
                onSelectMeeting(meeting.id);
                // If there's a way to navigate to the meeting-detail page, call it here
                // For now, we'll assume the parent component handles navigation
              }}
              className="btn btn-primary"
            >
              📋 Detailed View
            </button>
          )}
        </div>
      </div>

      {/* Modern Meeting Details Modal */}
      {showDetails && meetingDetails && (
        <MeetingDetailsModal
          meeting={meetingDetails}
          onClose={() => setShowDetails(false)}
          onNavigateToMeeting={onNavigateToMeeting}
          onNavigateToChat={onNavigateToChat}
        />
      )}
    </>
  );
}
