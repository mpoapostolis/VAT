import React from "react";
import { useSettings } from "../../lib/hooks/useSettings";
import { cn } from "../../lib/utils";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <div className="space-y-4">
    <h3 className="text-xs font-medium text-gray-900">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export function SettingsForm() {
  const { settings, updateSettings, resetSettings, loading } = useSettings();

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const handleUserPreferencesChange = async (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    await updateSettings("userPreferences", { [name]: value });
  };

  const handleVATSettingsChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ["defaultVATRate"];
    const finalValue = numericFields.includes(name) ? Number(value) : value;
    await updateSettings("vatSettings", { [name]: finalValue });
  };

  const handleNotificationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    await updateSettings("notifications", { [name]: checked });
  };

  return (
    <div className="space-y-8 p-6">
      <SettingsSection title="User Preferences">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Theme
            </label>
            <select
              name="theme"
              value={settings.userPreferences.theme}
              onChange={handleUserPreferencesChange}
              className={cn(
                "w-full rounded border border-gray-300 px-3 py-2",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              )}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Language
            </label>
            <select
              name="language"
              value={settings.userPreferences.language}
              onChange={handleUserPreferencesChange}
              className={cn(
                "w-full rounded border border-gray-300 px-3 py-2",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              )}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="VAT Settings">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Default VAT Rate (%)
            </label>
            <input
              type="number"
              name="defaultVATRate"
              value={settings.vatSettings.defaultVATRate}
              onChange={handleVATSettingsChange}
              className={cn(
                "w-full rounded border border-gray-300 px-3 py-2",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              VAT Period
            </label>
            <select
              name="vatPeriodType"
              value={settings.vatSettings.vatPeriodType}
              onChange={handleVATSettingsChange}
              className={cn(
                "w-full rounded border border-gray-300 px-3 py-2",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              )}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              VAT Number
            </label>
            <input
              type="text"
              name="vatNumber"
              value={settings.vatSettings.vatNumber}
              onChange={handleVATSettingsChange}
              className={cn(
                "w-full rounded border border-gray-300 px-3 py-2",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={settings.vatSettings.businessName}
              onChange={handleVATSettingsChange}
              className={cn(
                "w-full rounded border border-gray-300 px-3 py-2",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              )}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.notifications.emailNotifications}
              onChange={handleNotificationChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-xs text-gray-700">Email Notifications</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="vatReturnReminders"
              checked={settings.notifications.vatReturnReminders}
              onChange={handleNotificationChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-xs text-gray-700">VAT Return Reminders</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="dueDateReminders"
              checked={settings.notifications.dueDateReminders}
              onChange={handleNotificationChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-xs text-gray-700">Due Date Reminders</span>
          </label>
        </div>
      </SettingsSection>

      <div className="flex justify-end space-x-4">
        <button
          onClick={resetSettings}
          className={cn(
            "rounded px-4 py-2 text-xs font-medium text-gray-700",
            "border border-gray-300 bg-white",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
