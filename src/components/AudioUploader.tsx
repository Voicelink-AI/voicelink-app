import { useState, useRef } from 'react';
import { VoiceLinkAPI } from '../services/api';

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

export default function AudioUploader({ onFileUpload, isProcessing = false }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
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

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call real API
      const response = await VoiceLinkAPI.uploadAudio(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onFileUpload(file);
      
      console.log('Audio upload successful:', response);
    } catch (error) {
      console.error('Failed to upload audio:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload audio file. Please try again.');
      resetUpload();
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="audio-uploader">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Audio File</h3>
        {uploadedFile && (
          <button onClick={resetUpload} className="btn btn-secondary text-sm">
            Upload New File
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-2">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />
        
        {uploadedFile ? (
          <div className="file-info">
            <div className="text-4xl mb-3">📁</div>
            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
            <p className="text-gray-500">{formatFileSize(uploadedFile.size)}</p>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4 w-full max-w-md">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
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
            
            {uploadProgress === 100 && (
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <div>✅</div>
                <span className="text-sm">Upload complete!</span>
              </div>
            )}
            
            {isProcessing && (
              <div className="mt-4 flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Processing audio...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="text-4xl mb-4">🎵</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your audio file here or click to browse
            </p>
            <p className="text-gray-500">
              Supports {acceptedFormats.join(', ')} • Max size: 100MB
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Tip: For best results, ensure clear audio with minimal background noise</p>
      </div>
    </div>
  );
}
