import React, { useState } from 'react';
import MeetingDetailModal from './MeetingDetailModal';

export default function MeetingsPage() {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetails = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMeetingId(null);
  };

  const meetings = [
    { id: '1', title: 'Meeting 1' },
    { id: '2', title: 'Meeting 2' },
  ];

  return (
    <div className="meetings-page">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="meeting-card">
          <h3>{meeting.title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewDetails(meeting.id)}
              className="btn btn-primary text-sm"
            >
              📋 View Details
            </button>
          </div>
        </div>
      ))}

      {selectedMeetingId && (
        <MeetingDetailModal
          meetingId={selectedMeetingId}
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
