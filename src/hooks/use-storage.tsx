import { useEffect, useMemo, useState } from "react";

export const STORAGE_KEYS_PREFIX = "Diafi_";

const createStorageHook = (getStorage: () => Storage, keyPrefix: string) => {
  return function useStorage<T>(
    storageKey: string,
    fallbackState: T,
  ): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
    if (!storageKey)
      throw new Error(`"storageKey" must be a nonempty 
      string, but "${storageKey}" was passed.`);

    const [storage, setStorage] = useState<Storage | null>(null);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setStorage(getStorage());
      }
    }, []);

    const parsedObject: T | null = useMemo(() => {
      if (storage === null) return null;

      const storedString = storage.getItem(keyPrefix + storageKey);
      if (storedString === null) return null;

      return JSON.parse(storedString);
    }, [storage, storageKey]);

    const [value, setValue] = useState<T>(fallbackState);

    useEffect(() => {
      if (parsedObject !== null) {
        setValue(parsedObject);
      }
    }, [parsedObject]);

    useEffect(() => {
      if (storage) {
        storage.setItem(keyPrefix + storageKey, JSON.stringify(value));
      }
    }, [storage, storageKey, value]);

    const clearStorage = () => {
      if (storage) {
        storage.removeItem(keyPrefix + storageKey);
        setValue(fallbackState);
      }
    };

    return [value, setValue, clearStorage];
  };
};

const useLocalStorage = createStorageHook(
  () => localStorage,
  STORAGE_KEYS_PREFIX,
);
const useSessionStorage = createStorageHook(
  () => sessionStorage,
  STORAGE_KEYS_PREFIX,
);

export { useLocalStorage, useSessionStorage };
