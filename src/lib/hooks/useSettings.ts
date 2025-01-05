import { useState, useCallback, useEffect } from 'react';
import { ApplicationSettings, UpdateSettingsFunction } from '../../types/settings';

const defaultSettings: ApplicationSettings = {
  userPreferences: {
    theme: 'system',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: '£#,##0.00',
  },
  vatSettings: {
    defaultVATRate: 20,
    vatPeriodType: 'quarterly',
    vatNumber: '',
    businessName: '',
    businessAddress: '',
  },
  notifications: {
    emailNotifications: true,
    vatReturnReminders: true,
    dueDateReminders: true,
    systemNotifications: true,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<ApplicationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = localStorage.getItem('vatAppSettings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings: UpdateSettingsFunction = useCallback(
    async (section, newSettings) => {
      try {
        const updatedSettings = {
          ...settings,
          [section]: {
            ...settings[section],
            ...newSettings,
          },
        };
        setSettings(updatedSettings);
        localStorage.setItem('vatAppSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Failed to update settings:', error);
        throw error;
      }
    },
    [settings]
  );

  const resetSettings = useCallback(async () => {
    try {
      setSettings(defaultSettings);
      localStorage.setItem('vatAppSettings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    loading,
  };
}
