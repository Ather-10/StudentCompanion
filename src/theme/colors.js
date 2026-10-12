export const ACCENT = { violet: '#5B4BFF', mint: '#17A37F', amber: '#F2A024', rose: '#E8466B' };

export const LIGHT = {
  ...ACCENT,
  isDark: false,
  paper: '#F5F4FA', card: '#FFFFFF', hero: '#16132E',
  text: '#16132E', muted: '#6F6C85', line: '#E8E6F2', tabInactive: '#A19FB5',
};

export const DARK = {
  ...ACCENT,
  violet: '#8173FF',
  isDark: true,
  paper: '#0F0D1F', card: '#1B1836', hero: '#2B2569',
  text: '#F1F0FA', muted: '#9B98B8', line: '#2C2850', tabInactive: '#7D7A99',
};
