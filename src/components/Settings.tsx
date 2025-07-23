import { useState } from 'react';

interface SettingsState {
  apiSettings: {
    baseUrl: string;
    timeout: number;
  };
  processingSettings: {
    audioQuality: 'low' | 'medium' | 'high';
    speakerDetection: boolean;
    codeDetection: boolean;
  };
  uiSettings: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
  };
  integrations: {
    githubEnabled: boolean;
    githubToken: string;
    slackEnabled: boolean;
    slackWebhook: string;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    apiSettings: {
      baseUrl: 'http://localhost:8000',
      timeout: 30000,
    },
    processingSettings: {
      audioQuality: 'high',
      speakerDetection: true,
      codeDetection: true,
    },
    uiSettings: {
      theme: 'light',
      language: 'en',
      notifications: true,
    },
    integrations: {
      githubEnabled: false,
      githubToken: '',
      slackEnabled: false,
      slackWebhook: '',
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage for demo
    localStorage.setItem('voicelink-settings', JSON.stringify(settings));
    
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const updateSettings = (section: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="settings-container">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure VoiceLink to match your workflow and preferences.</p>
      </div>

      {/* API Settings */}
      <div className="settings-section">
        <h3>🔗 API Configuration</h3>
        <div className="form-group">
          <label className="form-label">API Base URL</label>
          <input
            type="url"
            className="form-input"
            value={settings.apiSettings.baseUrl}
            onChange={(e) => updateSettings('apiSettings', 'baseUrl', e.target.value)}
            placeholder="http://localhost:8000"
          />
          <p className="form-description">Base URL for the VoiceLink API server</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">Request Timeout (ms)</label>
          <input
            type="number"
            className="form-input"
            value={settings.apiSettings.timeout}
            onChange={(e) => updateSettings('apiSettings', 'timeout', parseInt(e.target.value))}
            min="5000"
            max="300000"
          />
          <p className="form-description">Maximum time to wait for API responses</p>
        </div>
      </div>

      {/* Processing Settings */}
      <div className="settings-section">
        <h3>⚡ Processing Options</h3>
        <div className="form-group">
          <label className="form-label">Audio Quality</label>
          <select
            className="form-select"
            value={settings.processingSettings.audioQuality}
            onChange={(e) => updateSettings('processingSettings', 'audioQuality', e.target.value)}
          >
            <option value="low">Low (Faster processing)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (Best accuracy)</option>
          </select>
          <p className="form-description">Higher quality provides better transcription accuracy but takes longer</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.processingSettings.speakerDetection}
              onChange={(e) => updateSettings('processingSettings', 'speakerDetection', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">Enable Speaker Detection</span>
          </label>
          <p className="form-description">Identify and separate different speakers in the audio</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.processingSettings.codeDetection}
              onChange={(e) => updateSettings('processingSettings', 'codeDetection', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">Enable Code Context Detection</span>
          </label>
          <p className="form-description">Detect mentions of GitHub issues, PRs, and technical terms</p>
        </div>
      </div>

      {/* UI Settings */}
      <div className="settings-section">
        <h3>🎨 Interface</h3>
        <div className="form-group">
          <label className="form-label">Theme</label>
          <select
            className="form-select"
            value={settings.uiSettings.theme}
            onChange={(e) => updateSettings('uiSettings', 'theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System preference)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            className="form-select"
            value={settings.uiSettings.language}
            onChange={(e) => updateSettings('uiSettings', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.uiSettings.notifications}
              onChange={(e) => updateSettings('uiSettings', 'notifications', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">Enable Notifications</span>
          </label>
          <p className="form-description">Show browser notifications when processing is complete</p>
        </div>
      </div>

      {/* Integrations */}
      <div className="settings-section">
        <h3>🔌 Integrations</h3>
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.integrations.githubEnabled}
              onChange={(e) => updateSettings('integrations', 'githubEnabled', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">Enable GitHub Integration</span>
          </label>
          <p className="form-description">Connect with GitHub to detect issue and PR references</p>
        </div>
        
        {settings.integrations.githubEnabled && (
          <div className="form-group">
            <label className="form-label">GitHub Personal Access Token</label>
            <input
              type="password"
              className="form-input"
              value={settings.integrations.githubToken}
              onChange={(e) => updateSettings('integrations', 'githubToken', e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <p className="form-description">Required for private repository access</p>
          </div>
        )}
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.integrations.slackEnabled}
              onChange={(e) => updateSettings('integrations', 'slackEnabled', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">Enable Slack Notifications</span>
          </label>
          <p className="form-description">Send meeting summaries to Slack</p>
        </div>
        
        {settings.integrations.slackEnabled && (
          <div className="form-group">
            <label className="form-label">Slack Webhook URL</label>
            <input
              type="url"
              className="form-input"
              value={settings.integrations.slackWebhook}
              onChange={(e) => updateSettings('integrations', 'slackWebhook', e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              💾 Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
