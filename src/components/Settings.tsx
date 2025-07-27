import { useState, useEffect } from 'react';
import { VoiceLinkAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../utils/translations';
import APIDebugger from './APIDebugger';
import EndpointTester from './EndpointTester';
import TestUploadComponent from './TestUploadComponent';

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
  const { theme: currentTheme, setTheme, language: currentLanguage, setLanguage, notifications: currentNotifications, setNotifications } = useTheme();
  
  // Local preview state - not applied until save
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark' | 'auto'>(currentTheme);
  const [previewLanguage, setPreviewLanguage] = useState(currentLanguage);
  const [previewNotifications, setPreviewNotifications] = useState(currentNotifications);
  
  const { t } = useTranslation(previewLanguage);
  
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
      theme: currentTheme,
      language: currentLanguage,
      notifications: currentNotifications,
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
    
    try {
      // Apply theme and language changes
      setTheme(previewTheme);
      setLanguage(previewLanguage);
      setNotifications(previewNotifications);
      
      // Update local settings state
      setSettings(prev => ({
        ...prev,
        uiSettings: {
          theme: previewTheme,
          language: previewLanguage,
          notifications: previewNotifications,
        }
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo
      localStorage.setItem('voicelink-settings', JSON.stringify(settings));
      
      alert('Settings saved successfully! Theme and language changes applied.');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('settings.title')}</h2>
        <p className="text-gray-600">Configure VoiceLink to match your workflow and preferences.</p>
        <div className="text-sm text-gray-500 mt-2">
          Preview: {t('settings.language')}: {previewLanguage.toUpperCase()} | {t('settings.theme')}: {previewTheme}
        </div>
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
          <label className="form-label">{t('settings.theme')}</label>
          <select
            className="form-select"
            value={previewTheme}
            onChange={(e) => setPreviewTheme(e.target.value as 'light' | 'dark' | 'auto')}
          >
            <option value="light">☀️ {t('settings.lightTheme')}</option>
            <option value="dark">🌙 {t('settings.darkTheme')}</option>
            <option value="auto">🔄 {t('settings.autoTheme')}</option>
          </select>
          <p className="form-description">{t('settings.themePreviewDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">{t('settings.language')}</label>
          <select
            className="form-select"
            value={previewLanguage}
            onChange={(e) => setPreviewLanguage(e.target.value as any)}
          >
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="pt">🇵🇹 Português</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="ko">🇰🇷 한국어</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
          <p className="form-description">{t('settings.languageDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={previewNotifications}
              onChange={(e) => setPreviewNotifications(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.notifications')}</span>
          </label>
          <p className="form-description">{t('settings.notificationsDescription')}</p>
        </div>

        {/* Theme Preview */}
        <div className="form-group">
          <label className="form-label">{t('settings.themePreview')}</label>
          <div className="grid grid-cols-3 gap-3">
            <div className={`text-center cursor-pointer p-2 rounded-lg border ${previewTheme === 'light' ? 'ring-2 ring-blue-500' : 'border-gray-200'}`} 
                 onClick={() => setPreviewTheme('light')}>
              <div className="w-full h-16 bg-white border border-gray-200 rounded-lg mb-2 flex items-center justify-center shadow-sm">
                <div className="w-8 h-8 bg-gray-100 rounded border"></div>
              </div>
              <span className="text-xs text-gray-600">☀️ {t('settings.lightTheme')}</span>
            </div>
            <div className={`text-center cursor-pointer p-2 rounded-lg border ${previewTheme === 'dark' ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}
                 onClick={() => setPreviewTheme('dark')}>
              <div className="w-full h-16 bg-gray-800 border border-gray-600 rounded-lg mb-2 flex items-center justify-center shadow-sm">
                <div className="w-8 h-8 bg-gray-700 rounded border border-gray-600"></div>
              </div>
              <span className="text-xs text-gray-600">🌙 {t('settings.darkTheme')}</span>
            </div>
            <div className={`text-center cursor-pointer p-2 rounded-lg border ${previewTheme === 'auto' ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}
                 onClick={() => setPreviewTheme('auto')}>
              <div className="w-full h-16 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded-lg mb-2 flex items-center justify-center shadow-sm">
                <div className="w-8 h-8 bg-gray-400 rounded border"></div>
              </div>
              <span className="text-xs text-gray-600">🔄 {t('settings.autoTheme')}</span>
            </div>
          </div>
          <p className="form-description mt-2">{t('settings.themePreviewDescription')}</p>
        </div>

        {/* Current vs Preview Indicator */}
        {(previewTheme !== currentTheme || previewLanguage !== currentLanguage || previewNotifications !== currentNotifications) && (
          <div className="form-group">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="text-blue-500">ℹ️</div>
                <div>
                  <p className="text-sm font-medium text-blue-800">{t('settings.unsavedChanges')}</p>
                  <p className="text-xs text-blue-600">
                    {t('settings.theme')}: {currentTheme} → {previewTheme} | 
                    {t('settings.language')}: {currentLanguage} → {previewLanguage} | 
                    {t('settings.notifications')}: {currentNotifications ? t('common.on') : t('common.off')} → {previewNotifications ? t('common.on') : t('common.off')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Settings */}
      <div className="settings-section">
        <h3>♿ Accessibility</h3>
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">High Contrast Mode</span>
          </label>
          <p className="form-description">Increase contrast for better visibility</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">Reduce Motion</span>
          </label>
          <p className="form-description">Minimize animations and transitions</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">Font Size</label>
          <select className="form-select" defaultValue="medium">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
          <p className="form-description">Adjust text size for better readability</p>
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

      {/* API Debug Section */}
      <div className="settings-section">
        <h3>🔧 API Debugging & Testing</h3>
        <p className="text-sm text-gray-600 mb-4">
          Test VoiceLink API endpoints and complete workflows to diagnose issues.
        </p>
        
        <div className="space-y-6">
          <TestUploadComponent />
          <APIDebugger />
          <EndpointTester />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            setPreviewTheme(currentTheme);
            setPreviewLanguage(currentLanguage);
            setPreviewNotifications(currentNotifications);
          }}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          🔄 {t('common.reset')}
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving || (previewTheme === currentTheme && previewLanguage === currentLanguage && previewNotifications === currentNotifications)}
          className="btn btn-primary"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {t('common.saving')}
            </>
          ) : (
            <>
              💾 {t('common.save')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
