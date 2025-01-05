import React from "react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Building2, CreditCard, Bell } from "lucide-react";
import { useSettings } from "@/lib/hooks/useSettings";

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];

export function Settings() {
  const { settings, updateSettings, resetSettings, loading } = useSettings();

  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </AnimatedPage>
    );
  }

  const handleVATSettingsChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    await updateSettings("vatSettings", { [name]: value });
  };

  const handleNotificationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    await updateSettings("notifications", { [name]: checked });
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-xs font-medium mb-6">Company Information</h2>
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      name="businessName"
                      value={settings.vatSettings.businessName}
                      onChange={handleVATSettingsChange}
                    />
                  </div>
                </FormItem>

                <FormItem>
                  <FormLabel>VAT Number</FormLabel>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      name="vatNumber"
                      value={settings.vatSettings.vatNumber}
                      onChange={handleVATSettingsChange}
                    />
                  </div>
                </FormItem>

                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Default VAT Rate (%)</FormLabel>
                    <Input
                      type="number"
                      name="defaultVATRate"
                      value={settings.vatSettings.defaultVATRate}
                      onChange={handleVATSettingsChange}
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel>VAT Period</FormLabel>
                    <Select
                      options={[
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" },
                        { value: "annually", label: "Annually" },
                      ]}
                      value={settings.vatSettings.vatPeriodType}
                      onChange={(value) =>
                        updateSettings("vatSettings", { vatPeriodType: value })
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-xs font-medium mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Email Notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        Receive email updates about your VAT returns
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">
                        VAT Return Reminders
                      </p>
                      <p className="text-xs text-gray-500">
                        Get notified when VAT returns are due
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="vatReturnReminders"
                    checked={settings.notifications.vatReturnReminders}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Due Date Reminders
                      </p>
                      <p className="text-xs text-gray-500">
                        Get notified about upcoming payment due dates
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="dueDateReminders"
                    checked={settings.notifications.dueDateReminders}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-xs font-medium mb-6">Display Preferences</h2>
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select
                    options={[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                      { value: "system", label: "System" },
                    ]}
                    value={settings.userPreferences.theme}
                    onChange={(value) =>
                      updateSettings("userPreferences", { theme: value })
                    }
                  />
                </FormItem>

                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    options={[
                      { value: "en", label: "English" },
                      { value: "es", label: "Spanish" },
                      { value: "fr", label: "French" },
                    ]}
                    value={settings.userPreferences.language}
                    onChange={(value) =>
                      updateSettings("userPreferences", { language: value })
                    }
                  />
                </FormItem>

                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    options={currencyOptions}
                    value={settings.userPreferences.currencyFormat}
                    onChange={(value) =>
                      updateSettings("userPreferences", {
                        currencyFormat: value,
                      })
                    }
                  />
                </FormItem>
              </div>
            </div>

            <div className="p-6">
              <Button
                onClick={resetSettings}
                variant="outline"
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
