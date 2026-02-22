import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    selectedQari: string;
    showLatin: boolean;
    showTranslation: boolean;
    setSelectedQari: (qari: string) => void;
    setShowLatin: (show: boolean) => void;
    setShowTranslation: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            selectedQari: '01', // Default qari
            showLatin: true,
            showTranslation: true,
            setSelectedQari: (qari) => set({ selectedQari: qari }),
            setShowLatin: (show) => set({ showLatin: show }),
            setShowTranslation: (show) => set({ showTranslation: show }),
        }),
        { name: 'kareem-settings' }
    )
);
