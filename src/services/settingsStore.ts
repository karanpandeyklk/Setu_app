import AsyncStorage from '@react-native-async-storage/async-storage';

// Demo only: saved on the phone, per user. These settings are not in the v0 API contract,
// so the real backend needs endpoints for them. Confirm with Baharath.
export type Settings = {
  pushNotifications: boolean; chatAlerts: boolean;
  showOnlineStatus: boolean; photosAfterConnect: boolean; hideFromDiscover: boolean;
  phoneVerified: boolean; photoVerified: boolean; idVerified: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  pushNotifications: true, chatAlerts: true,
  showOnlineStatus: true, photosAfterConnect: true, hideFromDiscover: false,
  phoneVerified: true, // the person signed in with a one-time code
  photoVerified: false, idVerified: false,
};

const keyFor = (userId: string) => `setu_settings:${userId}`;

export async function getSettings(userId: string): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(userId: string, patch: Partial<Settings>): Promise<void> {
  const current = await getSettings(userId);
  await AsyncStorage.setItem(keyFor(userId), JSON.stringify({ ...current, ...patch }));
}