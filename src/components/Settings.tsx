import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
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
  
  // Use current language for translations (no preview needed)
  const { t } = useTranslation();
  
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
        <p className="text-gray-600">{t('settings.description')}</p>
      </div>

      {/* API Settings */}
      <div className="settings-section">
        <h3>{t('settings.apiConfiguration')}</h3>
        <div className="form-group">
          <label className="form-label">{t('settings.apiBaseUrl')}</label>
          <input
            type="url"
            className="form-input"
            value={settings.apiSettings.baseUrl}
            onChange={(e) => updateSettings('apiSettings', 'baseUrl', e.target.value)}
            placeholder="http://localhost:8000"
          />
          <p className="form-description">{t('settings.apiBaseUrlDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">{t('settings.requestTimeout')}</label>
          <input
            type="number"
            className="form-input"
            value={settings.apiSettings.timeout}
            onChange={(e) => updateSettings('apiSettings', 'timeout', parseInt(e.target.value))}
            min="5000"
            max="300000"
          />
          <p className="form-description">{t('settings.requestTimeoutDescription')}</p>
        </div>
      </div>

      {/* Processing Settings */}
      <div className="settings-section">
        <h3>{t('settings.processingOptions')}</h3>
        <div className="form-group">
          <label className="form-label">{t('settings.audioQuality')}</label>
          <select
            className="form-select"
            value={settings.processingSettings.audioQuality}
            onChange={(e) => updateSettings('processingSettings', 'audioQuality', e.target.value)}
          >
            <option value="low">{t('settings.audioQualityLow')}</option>
            <option value="medium">{t('settings.audioQualityMedium')}</option>
            <option value="high">{t('settings.audioQualityHigh')}</option>
          </select>
          <p className="form-description">{t('settings.audioQualityDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.processingSettings.speakerDetection}
              onChange={(e) => updateSettings('processingSettings', 'speakerDetection', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.speakerDetection')}</span>
          </label>
          <p className="form-description">{t('settings.speakerDetectionDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.processingSettings.codeDetection}
              onChange={(e) => updateSettings('processingSettings', 'codeDetection', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.codeDetection')}</span>
          </label>
          <p className="form-description">{t('settings.codeDetectionDescription')}</p>
        </div>
      </div>

      {/* UI Settings */}
      <div className="settings-section">
        <h3>{t('settings.interface')}</h3>
        <div className="form-group">
          <label className="form-label">{t('settings.theme')}</label>
          <select
            className="form-select"
            value={currentTheme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
          >
            <option value="light">☀️ {t('settings.lightTheme')}</option>
            <option value="dark">🌙 {t('settings.darkTheme')}</option>
            <option value="auto">🔄 {t('settings.autoTheme')}</option>
          </select>
          <p className="form-description">Choose your preferred color scheme (changes apply immediately)</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">{t('settings.language')}</label>
          <select
            className="form-select"
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as any)}
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
          <p className="form-description">Select your preferred language (changes apply immediately)</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={currentNotifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.notifications')}</span>
          </label>
          <p className="form-description">{t('settings.notificationsDescription')}</p>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="settings-section">
        <h3>{t('settings.accessibility')}</h3>
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.highContrastMode')}</span>
          </label>
          <p className="form-description">{t('settings.highContrastDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.reduceMotion')}</span>
          </label>
          <p className="form-description">{t('settings.reduceMotionDescription')}</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">{t('settings.fontSize')}</label>
          <select className="form-select" defaultValue="medium">
            <option value="small">{t('settings.fontSizeSmall')}</option>
            <option value="medium">{t('settings.fontSizeMedium')}</option>
            <option value="large">{t('settings.fontSizeLarge')}</option>
            <option value="extra-large">{t('settings.fontSizeExtraLarge')}</option>
          </select>
          <p className="form-description">{t('settings.fontSizeDescription')}</p>
        </div>
      </div>

      {/* Integrations */}
      <div className="settings-section">
        <h3>{t('settings.integrations')}</h3>
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.integrations.githubEnabled}
              onChange={(e) => updateSettings('integrations', 'githubEnabled', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="form-label mb-0">{t('settings.githubIntegration')}</span>
          </label>
          <p className="form-description">{t('settings.githubIntegrationDescription')}</p>
        </div>
        
        {settings.integrations.githubEnabled && (
          <div className="form-group">
            <label className="form-label">{t('settings.githubToken')}</label>
            <input
              type="password"
              className="form-input"
              value={settings.integrations.githubToken}
              onChange={(e) => updateSettings('integrations', 'githubToken', e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <p className="form-description">{t('settings.githubTokenDescription')}</p>
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
            <span className="form-label mb-0">{t('settings.slackIntegration')}</span>
          </label>
          <p className="form-description">{t('settings.slackIntegrationDescription')}</p>
        </div>
        
        {settings.integrations.slackEnabled && (
          <div className="form-group">
            <label className="form-label">{t('settings.slackWebhook')}</label>
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
        <h3>{t('settings.apiDebugging')}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('settings.apiDebuggingDescription')}
        </p>
        
        <div className="space-y-6">
          <TestUploadComponent />
          <APIDebugger />
          <EndpointTester />
        </div>
      </div>
    </div>
  );
}
