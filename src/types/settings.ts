export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  currencyFormat: string;
}

export interface VATSettings {
  defaultVATRate: number;
  vatPeriodType: 'monthly' | 'quarterly' | 'annually';
  vatNumber: string;
  businessName: string;
  businessAddress: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  vatReturnReminders: boolean;
  dueDateReminders: boolean;
  systemNotifications: boolean;
}

export interface ApplicationSettings {
  userPreferences: UserPreferences;
  vatSettings: VATSettings;
  notifications: NotificationSettings;
}

export type UpdateSettingsFunction = (
  section: keyof ApplicationSettings,
  settings: Partial<ApplicationSettings[keyof ApplicationSettings]>
) => Promise<void>;
