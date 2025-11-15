import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, X, Save, Clock, Target } from 'lucide-react';

interface AutoPilotSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AutoPilotSettings) => void;
  initialSettings?: AutoPilotSettings;
}

export interface AutoPilotSettings {
  autoApplyCRMUpdates: boolean;
  autoSendMessages: boolean;
  autoOpenProfiles: boolean;
  timeboxMinutes: number;
  confidenceThreshold: number;
}

const DEFAULT_SETTINGS: AutoPilotSettings = {
  autoApplyCRMUpdates: false,
  autoSendMessages: false,
  autoOpenProfiles: true,
  timeboxMinutes: 30,
  confidenceThreshold: 70,
};

export default function AutoPilotSettings({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}: AutoPilotSettingsProps) {
  const [settings, setSettings] = useState<AutoPilotSettings>(
    initialSettings || DEFAULT_SETTINGS
  );

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('autopilot_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('autopilot_settings', JSON.stringify(settings));
    onSave(settings);
    onClose();
  };

  const updateSetting = <K extends keyof AutoPilotSettings>(
    key: K,
    value: AutoPilotSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-content">AutoPilot Settings</h3>
              <p className="text-sm text-secondary-content">Configure automation preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-secondary-content" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Automation Toggles */}
          <div>
            <h4 className="text-sm font-medium text-primary-content mb-3">Automation Features</h4>
            
            <div className="space-y-3">
              {/* Auto-apply CRM Updates */}
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-content">Auto-apply CRM Updates</p>
                  <p className="text-xs text-secondary-content">
                    Automatically apply non-outbound updates like tags and notes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoApplyCRMUpdates}
                    onChange={(e) => updateSetting('autoApplyCRMUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Auto-send Messages */}
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-content">Auto-send Messages</p>
                  <p className="text-xs text-secondary-content">
                    Automatically send pre-approved templated messages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSendMessages}
                    onChange={(e) => updateSetting('autoSendMessages', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Auto-open Profiles */}
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-content">Auto-open Profiles</p>
                  <p className="text-xs text-secondary-content">
                    Automatically open lead profiles as AutoPilot processes them
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoOpenProfiles}
                    onChange={(e) => updateSetting('autoOpenProfiles', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Timebox */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-primary-content">Session Duration</h4>
            </div>
            
            <div className="p-3 glass-effect rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary-content">Timebox (minutes)</span>
                <span className="text-lg font-bold text-primary">{settings.timeboxMinutes}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={settings.timeboxMinutes}
                onChange={(e) => updateSetting('timeboxMinutes', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-secondary-content mt-1">
                <span>10 min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-primary-content">Confidence Threshold</h4>
            </div>
            
            <div className="p-3 glass-effect rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary-content">Minimum confidence for auto-apply</span>
                <span className="text-lg font-bold text-primary">{settings.confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={settings.confidenceThreshold}
                onChange={(e) => updateSetting('confidenceThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-secondary-content mt-1">
                <span>50%</span>
                <span>90%</span>
              </div>
              <p className="text-xs text-secondary-content mt-2">
                Actions below this threshold will require manual approval
              </p>
            </div>
          </div>

          {/* Preview Mode Info */}
          <div className="p-3 bg-semantic-info/10 rounded-lg border border-semantic-info/20">
            <p className="text-xs text-semantic-info">
              💡 <strong>Preview Mode:</strong> All actions will be shown for review before execution, 
              regardless of settings. You maintain full control.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-dark-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-medium text-secondary-content hover:text-primary-content transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
