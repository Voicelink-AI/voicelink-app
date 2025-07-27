import { useState } from 'react';
import { type MeetingCreateRequest } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

interface CreateMeetingModalProps {
  onSubmit: (data: MeetingCreateRequest) => void;
  onClose: () => void;
}

export default function CreateMeetingModal({ onSubmit, onClose }: CreateMeetingModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<MeetingCreateRequest>({
    title: '',
    participants: [],
    description: '',
  });

  const [participantInput, setParticipantInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('createMeeting.titleRequired');
    }

    if (formData.title.trim().length < 3) {
      newErrors.title = t('createMeeting.titleMinLength');
    }

    if (participantInput.trim() && !isValidEmail(participantInput.trim())) {
      newErrors.participant = t('createMeeting.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to create meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addParticipant = () => {
    const email = participantInput.trim();
    
    if (!email) {
      return;
    }

    if (!isValidEmail(email)) {
      setErrors({ ...errors, participant: t('createMeeting.invalidEmail') });
      return;
    }

    if (formData.participants.includes(email)) {
      setErrors({ ...errors, participant: t('createMeeting.participantExists') });
      return;
    }

    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, email]
    }));
    setParticipantInput('');
    setErrors({ ...errors, participant: '' });
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipant();
    }
  };

  // Close modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">📅 {t('meetings.createMeeting')}</h3>
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
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Meeting Title */}
            <div className="form-group">
              <label className="form-label">
                {t('meetings.title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'error' : formData.title.trim() ? 'success' : ''}`}
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                placeholder={t('createMeeting.titlePlaceholder')}
                required
                autoFocus
              />
              {errors.title && (
                <div className="form-error">{errors.title}</div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">{t('createMeeting.description')}</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('createMeeting.descriptionPlaceholder')}
              />
              <div className="form-description">
                Provide additional context or agenda for the meeting
              </div>
            </div>

            {/* Participants */}
            <div className="form-group">
              <label className="form-label">
                Participants
                {formData.participants.length > 0 && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({formData.participants.length} added)
                  </span>
                )}
              </label>
              
              <div className="participant-input-group">
                <input
                  type="email"
                  className={`form-input participant-input ${errors.participant ? 'error' : ''}`}
                  placeholder="participant@example.com"
                  value={participantInput}
                  onChange={(e) => {
                    setParticipantInput(e.target.value);
                    if (errors.participant) {
                      setErrors({ ...errors, participant: '' });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  type="button" 
                  onClick={addParticipant} 
                  className="btn btn-secondary"
                  disabled={!participantInput.trim()}
                >
                  Add
                </button>
              </div>
              
              {errors.participant && (
                <div className="form-error">{errors.participant}</div>
              )}
              
              {/* Participants List */}
              {formData.participants.length > 0 && (
                <div className="participant-list">
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="participant-item">
                      <div className="participant-email">{participant}</div>
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="participant-remove"
                        aria-label={`Remove ${participant}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="form-description">
                Add email addresses of meeting participants
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating...
                </>
              ) : (
                <>
                  📅 {t('meetings.createMeeting')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
