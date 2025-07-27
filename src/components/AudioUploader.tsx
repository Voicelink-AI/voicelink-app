import { useState, useRef } from 'react';
import { processMeetingAudio } from '../utils/meetingApi';

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
}

export default function AudioUploader({
  onFileUpload,
  onNavigateToMeeting,
  onNavigateToMeetings,
  onNavigateToChat,
  isProcessing = false
}: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      return 'Please select an audio file (WAV, MP3, M4A, or FLAC)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
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
      // Directly process meeting audio using the endpoint
      const result = await processMeetingAudio(file, "wav");
      setProcessingStage('complete');
      setProcessingResult({
        transcript: result.transcript,
        speakers: result.speakers,
        error: result.error
      });
      setTranscript(result.transcript);
      setSpeakers(result.speakers);
      onFileUpload(file);
    } catch (error) {
      setProcessingStage('error');
      let errorMessage = 'Failed to process audio file. Please try again.';
      if (error instanceof Error) errorMessage = error.message;
      setError(errorMessage);
      setProcessingResult({ error: errorMessage });
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
    setTranscript(null);
    setSpeakers([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="audio-uploader">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Audio File</h3>
        {uploadedFile && processingStage === 'complete' && !isProcessing && (
          <button onClick={resetUpload} className="btn btn-secondary text-sm">
            Upload Another File
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
                Try again
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

            {processingStage === 'complete' && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <span>✅</span>
                  <span className="text-sm font-medium">Audio processed successfully!</span>
                </div>
                {transcript && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Transcript:</h4>
                    <p className="text-blue-700">{transcript}</p>
                  </div>
                )}
                {speakers.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-md">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Speakers:</h4>
                    <ul>
                      {speakers.map((s, idx) => (
                        <li key={idx}>
                          <strong>{s.speaker_id}:</strong> {s.segments.map((seg: { text: string }) => seg.text).join(", ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="text-4xl mb-4">🎵</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your audio file here or click to browse
            </p>
            <p className="text-gray-500 mb-4">
              Supports {acceptedFormats.join(', ')} • Max size: 100MB
            </p>
            <p className="text-sm text-blue-600">
              ✨ Your audio will be processed and transcript generated
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 <strong>New Workflow:</strong> Upload → Process audio → View transcript and speakers</p>
      </div>
    </div>
  );
}
