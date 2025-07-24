export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  features: {
    voiceRecording: import.meta.env.VITE_VOICE_RECORDING !== 'false',
    blockchain: import.meta.env.VITE_BLOCKCHAIN !== 'false',
    githubIntegration: import.meta.env.VITE_GITHUB_INTEGRATION !== 'false',
  }
};
