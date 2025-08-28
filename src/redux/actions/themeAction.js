export const TOGGLE_THEME = 'TOGGLE_THEME';

export const toggleTheme = (payload) => {
  return {
    type: TOGGLE_THEME,
    payload
  };
};
