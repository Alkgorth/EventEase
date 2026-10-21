// Palette officielle de la charte graphique EventEase
export const palette = {
  sarcelle: '#125B50',
  corail: '#FF735C',
  sable: '#F4F1DE',
  blanc: '#FFFFFF',
  texteSombre: '#1E2D2A',
  texteGris: '#6B7280',
  bordure: '#E2DFCE',
  danger: '#DC2626',
};

// Rôles sémantiques utilisés dans les composants
export const colors = {
  primary: palette.sarcelle,
  secondary: palette.corail,
  accent: palette.corail,
  background: palette.sable,
  cardBackground: palette.blanc,
  text: palette.texteSombre,
  textMuted: palette.texteGris,
  border: palette.bordure,
  danger: palette.danger,
};

// Polices Nunito chargées via @expo-google-fonts/nunito
export const fonts = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
};

// Rayons d'arrondis cohérents avec la charte
export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  full: 9999,
};

// Espacements standards
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};