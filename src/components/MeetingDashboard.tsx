import { useState, useEffect } from 'react';
import { VoiceLinkAPI, type MeetingResponse, type MeetingCreateRequest } from '../services/api';

export default function MeetingDashboard() {
  const [meetings, setMeetings] = useState<MeetingResponse[]>([]);
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
      setMeetings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meetings');
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
    }
  };

  const handleStartMeeting = async (meetingId: string) => {
    try {
      await VoiceLinkAPI.startMeeting(meetingId);
      await loadMeetings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start meeting');
    }
  };

  const handleEndMeeting = async (meetingId: string) => {
    try {
      await VoiceLinkAPI.endMeeting(meetingId);
      await loadMeetings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end meeting');
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
          <option value="completed">Completed</option>
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
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onStart={() => handleStartMeeting(meeting.id)}
              onEnd={() => handleEndMeeting(meeting.id)}
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
  meeting: MeetingResponse;
  onStart: () => void;
  onEnd: () => void;
}

function MeetingCard({ meeting, onStart, onEnd }: MeetingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not set';
    return new Date(timeString).toLocaleString();
  };

  return (
    <div className="meeting-card">
      <div className="meeting-header">
        <h3 className="meeting-title">{meeting.title}</h3>
        <span className={`status-badge ${getStatusColor(meeting.status)}`}>
          {meeting.status}
        </span>
      </div>

      <div className="meeting-meta">
        <p className="meta-item">
          👥 {meeting.participants.length} participants
        </p>
        {meeting.scheduled_time && (
          <p className="meta-item">
            📅 {formatTime(meeting.scheduled_time)}
          </p>
        )}
        {meeting.start_time && (
          <p className="meta-item">
            ▶️ Started: {formatTime(meeting.start_time)}
          </p>
        )}
      </div>

      {meeting.description && (
        <div className="meeting-summary">
          <p>{meeting.description}</p>
        </div>
      )}

      <div className="meeting-actions">
        {meeting.status === 'scheduled' && (
          <button onClick={onStart} className="btn btn-primary">
            ▶️ Start Meeting
          </button>
        )}
        
        {meeting.status === 'active' && (
          <button onClick={onEnd} className="btn btn-secondary">
            ⏹️ End Meeting
          </button>
        )}
        
        <button className="btn btn-secondary">
          👁️ View Details
        </button>
      </div>
    </div>
  );
}

interface CreateMeetingModalProps {
  onSubmit: (data: MeetingCreateRequest) => void;
  onClose: () => void;
}

function CreateMeetingModal({ onSubmit, onClose }: CreateMeetingModalProps) {
  const [formData, setFormData] = useState<MeetingCreateRequest>({
    title: '',
    participants: [],
    description: '',
  });

  const [participantInput, setParticipantInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addParticipant = () => {
    if (participantInput.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()]
      }));
      setParticipantInput('');
    }
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Create New Meeting</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Meeting Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Participants</label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                className="form-input flex-1"
                placeholder="participant@example.com"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              />
              <button type="button" onClick={addParticipant} className="btn btn-secondary">
                Add
              </button>
            </div>
            
            <div className="space-y-1">
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{participant}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn btn-primary flex-1">
              Create Meeting
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
