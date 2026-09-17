import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  defaultLogo?: string;
  setDefaultLogo: (logo?: string) => void;
}

export const useSettingsStore = create<SettingsState>()(persist((set) => ({
  defaultLogo: undefined,
  setDefaultLogo: (defaultLogo) => set({ defaultLogo }),
}), { name: "templar-settings-v1" }));