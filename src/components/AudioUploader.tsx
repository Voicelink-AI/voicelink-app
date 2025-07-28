import { useState, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { VoiceLinkAPI } from '../services/api';

interface AudioUploaderProps {
  onFileUpload: (file: File, meetingId?: string) => void;
  onNavigateToMeeting?: (meetingId: string) => void;
  onNavigateToMeetings?: () => void;
  onNavigateToChat?: (meetingId: string) => void;
  isProcessing?: boolean;
}

interface ProcessingResult {
  transcript?: string;
  speakers?: any[];
  error?: string;
  meeting?: {
    meeting_id: string;
    title: string;
    status: string;
  };
  upload?: {
    file_id: string;
  };
}

export default function AudioUploader({
  onFileUpload,
  onNavigateToMeeting,
  onNavigateToMeetings,
  onNavigateToChat,
  isProcessing = false
}: AudioUploaderProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<'idle' | 'uploading' | 'creating_meeting' | 'complete' | 'error'>('idle');
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for navigating to the meeting
  const navigateToMeeting = () => {
    if (processingResult?.meeting?.meeting_id && onNavigateToMeeting) {
      onNavigateToMeeting(processingResult.meeting.meeting_id);
    }
  };

  // Handler for navigating to chat
  const navigateToChat = () => {
    if (processingResult?.meeting?.meeting_id && onNavigateToChat) {
      onNavigateToChat(processingResult.meeting.meeting_id);
    }
  };

  const acceptedFormats = ['.wav', '.mp3', '.m4a', '.flac'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('audio/') && !acceptedFormats.some(format => file.name.toLowerCase().endsWith(format.substring(1)))) {
      return t('uploader.invalidFileType');
    }

    if (file.size > maxSize) {
      return t('uploader.fileTooLarge');
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadedFile(file);
    setUploadProgress(0);
    setError(null);
    setProcessingResult(null);
    setProcessingStage('uploading');

    try {
      // First upload the audio file
      setProcessingStage('uploading');
      const uploadResult = await VoiceLinkAPI.uploadAudio(file);
      console.log('Upload result:', uploadResult);
      
      // Then create a meeting from the uploaded file
      setProcessingStage('creating_meeting');
      const meetingResult = await VoiceLinkAPI.createMeetingFromFile(
        uploadResult.file_id || uploadResult.id,
        `Meeting from ${file.name}`
      );
      console.log('Meeting result:', meetingResult);
      
      setProcessingStage('complete');
      setProcessingResult({
        transcript: meetingResult.transcript || uploadResult.transcript,
        speakers: meetingResult.speakers || uploadResult.speakers || [],
        meeting: {
          meeting_id: meetingResult.meeting_id || meetingResult.id,
          title: meetingResult.title || `Meeting from ${file.name}`,
          status: meetingResult.status || 'completed'
        },
        upload: {
          file_id: uploadResult.file_id || uploadResult.id
        }
      });
      
      onFileUpload(file, meetingResult.meeting_id || meetingResult.id);
    } catch (error) {
      setProcessingStage('error');
      let errorMessage = t('uploader.processingError');
      if (error instanceof Error) errorMessage = error.message;
      setError(errorMessage);
      setProcessingResult({ error: errorMessage });
    }
  };

  const getProcessingMessage = () => {
    switch (processingStage) {
      case 'uploading': return t('uploader.uploading');
      case 'creating_meeting': return t('uploader.creatingMeeting');
      case 'complete': return t('uploader.uploadComplete');
      case 'error': return t('uploader.processingFailed');
      default: return '';
    }
  };

  const getProcessingIcon = () => {
    switch (processingStage) {
      case 'uploading': return '📤';
      case 'creating_meeting': return '📋';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
    setProcessingStage('idle');
    setProcessingResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="audio-uploader">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('uploader.uploadAudioFile')}</h3>
        {uploadedFile && processingStage === 'complete' && !isProcessing && (
          <button onClick={resetUpload} className="btn btn-secondary text-sm">
            {t('uploader.uploadAnother')}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-2">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={resetUpload}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${processingStage !== 'idle' || isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => (processingStage === 'idle' && !isProcessing) && fileInputRef.current?.click()}
        style={{ cursor: (processingStage === 'idle' && !isProcessing) ? 'pointer' : 'default' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={processingStage !== 'idle' || isProcessing}
        />

        {uploadedFile ? (
          <div className="file-info">
            <div className="text-4xl mb-3">
              {processingStage === 'complete' ? '🎉' : '📁'}
            </div>
            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
            <p className="text-gray-500">{formatFileSize(uploadedFile.size)}</p>
            
            {/* Processing Progress */}
            {(processingStage === 'uploading') && (
              <div className="mt-4 w-full max-w-md">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{t('uploader.uploading')}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Processing Status */}
            {(processingStage === 'creating_meeting') && (
              <div className="mt-4 w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{getProcessingIcon()}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {getProcessingMessage()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300 animate-pulse w-full"></div>
                </div>
              </div>
            )}
            
            {/* Success Results */}
            {processingStage === 'complete' && processingResult?.meeting && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <span>✅</span>
                  <span className="text-sm font-medium">{t('uploader.meetingCreatedSuccess')}</span>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md">
                  <h4 className="text-sm font-medium text-green-800 mb-2">{t('uploader.meetingDetails')}</h4>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-medium text-green-700">{t('meetings.title')}:</p>
                      <p className="text-green-600">{processingResult.meeting.title}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-green-700">{t('uploader.meetingId')}:</p>
                      <p className="text-green-600 font-mono">{processingResult.meeting.meeting_id}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-green-700">{t('meetings.status')}:</p>
                      <p className="text-green-600 capitalize">{processingResult.meeting.status}</p>
                    </div>
                    
                    {processingResult.upload?.file_id && (
                      <div>
                        <p className="font-medium text-green-700">{t('uploader.fileId')}:</p>
                        <p className="text-green-600 font-mono text-xs">{processingResult.upload.file_id}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={navigateToMeeting}
                    className="btn btn-primary text-xs px-3 py-1"
                  >
                    📋 {t('uploader.viewMeeting')}
                  </button>
                  
                  <button
                    onClick={navigateToChat}
                    className="btn btn-secondary text-xs px-3 py-1"
                  >
                    💬 {t('uploader.askQuestions')}
                  </button>
                  
                  <button
                    onClick={() => onNavigateToMeetings && onNavigateToMeetings()}
                    className="btn btn-secondary text-xs px-3 py-1"
                  >
                    📝 {t('uploader.allMeetings')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="text-4xl mb-4">🎵</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {t('uploader.dropAudioHere')}
            </p>
            <p className="text-gray-500 mb-4">
              {t('uploader.supportsFormats', { formats: acceptedFormats.join(', ') })}
            </p>
            <p className="text-sm text-blue-600">
              ✨ {t('uploader.autoCreateMeeting')}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>{t('uploader.newWorkflow')}</p>
      </div>
    </div>
  );
}
