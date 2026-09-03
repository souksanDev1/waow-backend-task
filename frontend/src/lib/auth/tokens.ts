const ACCESS_KEY = "waow.accessToken";
const TEMP_KEY = "waow.tempToken";

const canUseStorage = () => typeof window !== "undefined";

export const getAccessToken = () =>
  canUseStorage() ? window.localStorage.getItem(ACCESS_KEY) : null;

export const getTempToken = () =>
  canUseStorage() ? window.localStorage.getItem(TEMP_KEY) : null;

export const setAccessToken = (token: string) => {
  window.localStorage.setItem(ACCESS_KEY, token);
};

export const setTempToken = (token: string) => {
  window.localStorage.setItem(TEMP_KEY, token);
};

export const clearTempToken = () => {
  window.localStorage.removeItem(TEMP_KEY);
};

export const clearSession = () => {
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(TEMP_KEY);
};
