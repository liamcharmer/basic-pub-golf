import { useState } from "#app";

export const useLocalStorage = () => {
  const storage = useState("localStorage", () => ({}));

  const setItem = (key: string, value: any) => {
    if (process.client) {
      localStorage.setItem(key, JSON.stringify(value));
      storage.value[key] = value;
    }
  };

  const getItem = (key: string) => {
    if (process.client) {
      if (!(key in storage.value)) {
        const value = localStorage.getItem(key);
        storage.value[key] = value ? JSON.parse(value) : null;
      }
      return storage.value[key];
    }
    return null;
  };

  const removeItem = (key: string) => {
    if (process.client) {
      localStorage.removeItem(key);
      delete storage.value[key];
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
};
