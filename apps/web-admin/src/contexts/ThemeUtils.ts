export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const themes: Record<string, ThemeColors> = {
  light: {
    primary: '#3b82f6',
    secondary: '#f87171',
    background: '#ffffff',
    text: '#1f2937',
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#fb923c',
    background: '#1f2937',
    text: '#f3f4f6',
  },
};

export const applyTheme = (theme: string, themeColors: ThemeColors) => {
  const root = document.documentElement;
  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  root.classList.toggle('dark', theme === 'dark');
};