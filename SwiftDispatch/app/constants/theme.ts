export const Colors = {
  // Brand — warm amber instead of neon orange
  primary: '#F59332',       // warm amber-orange, friendly not shouty
  primaryDark: '#D97706',   // deeper amber for pressed states
  primaryLight: '#FCD34D',  // soft golden highlight
  primaryBg: '#FFF8EE',     // barely-there tint for cards/badges

  // Neutrals
  secondary: '#111827',     // near-black (rich charcoal)
  background: '#F9FAFB',    // cool off-white
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',

  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  // Semantic
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  // UI chrome
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.5)',
  white: '#FFFFFF',
  black: '#000000',

  // Map / rider status
  mapOverlay: 'rgba(245,147,50,0.1)',
  riderOnline: '#16A34A',
  riderOffline: '#9CA3AF',
  riderBusy: '#D97706',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
};
