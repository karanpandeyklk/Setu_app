import { Platform } from 'react-native';
import { colors } from '../theme';

// Removes the browser's default black outline on web. The wrapper draws the blue border instead.
export const noOutline: any = Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {};

// Blue border (plus a soft ring on web) for a focused field wrapper
export const focusedBox: any = {
  borderColor: colors.primary,
  ...(Platform.OS === 'web' ? { boxShadow: '0 0 0 3px rgba(37,99,235,0.15)' } : {}),
};