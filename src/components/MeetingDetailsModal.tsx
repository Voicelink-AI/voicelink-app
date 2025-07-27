import React from 'react';
import { type MeetingResponse } from '../services/api';

interface MeetingDetailsModalProps {
  meeting: MeetingResponse;
  onClose: () => void;
  onNavigateToMeeting?: (meetingId: string) => void;
  onNavigateToChat?: (meetingId: string) => void;
}

export default function MeetingDetailsModal({ 
  meeting, 
  onClose, 
  onNavigateToMeeting, 
  onNavigateToChat 
}: MeetingDetailsModalProps) {
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

  // Close modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} tabIndex={-1}>
      <div className="modal-content" role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">📋 Meeting Details</h3>
          <button 
            onClick={onClose}
            className="modal-close"
            type="button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="space-y-4">
            <div>
              <h4 className="form-label">Title</h4>
              <p className="text-gray-900 font-semibold">{meeting.title}</p>
            </div>
            <div>
              <h4 className="form-label">Meeting ID</h4>
              <p className="text-gray-900 font-mono">{meeting.meeting_id}</p>
            </div>
            <div>
              <h4 className="form-label">Status</h4>
              <span className={`status-badge ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
            </div>
            {meeting.description && (
              <div>
                <h4 className="form-label">Description</h4>
                <p className="text-gray-900">{meeting.description}</p>
              </div>
            )}
            <div>
              <h4 className="form-label">Participants</h4>
              <div className="participant-list">
                {meeting.participants?.length > 0 ? (
                  meeting.participants.map((participant: any, index: number) => (
                    <div key={index} className="participant-item">
                      <div className="participant-email">
                        {typeof participant === 'string' ? participant : participant.email}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No participants listed</p>
                )}
              </div>
            </div>
            {meeting.created_at && (
              <div>
                <h4 className="form-label">Created</h4>
                <p className="text-gray-900">{new Date(meeting.created_at).toLocaleString()}</p>
              </div>
            )}
            {meeting.start_time && (
              <div>
                <h4 className="form-label">Started</h4>
                <p className="text-gray-900">{new Date(meeting.start_time).toLocaleString()}</p>
              </div>
            )}
            {meeting.transcript && (
              <div>
                <h4 className="form-label">Transcript</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700 break-all">{meeting.transcript}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer flex-wrap gap-3">
          <button 
            onClick={() => {
              console.log('Navigating to meeting:', meeting.meeting_id);
              onNavigateToMeeting?.(meeting.meeting_id);
              onClose();
            }}
            className="btn btn-primary flex-1 min-w-0"
          >
            📋 View Details
          </button>
          <button 
            onClick={() => {
              onNavigateToChat?.(meeting.meeting_id);
              onClose();
            }}
            className="btn btn-primary flex-1 min-w-0"
          >
            💬 Chat about this meeting
          </button>
          <button 
            onClick={() => console.log('Blockchain verification for:', meeting.meeting_id)}
            className="btn btn-secondary flex-1 min-w-0"
          >
            🔗 Blockchain verification
          </button>
          <button 
            onClick={onClose}
            className="btn btn-secondary w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
