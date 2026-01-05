
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
    hasOnboarded: boolean;
    _hasHydrated: boolean;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            hasOnboarded: false,
            _hasHydrated: false,
            completeOnboarding: () => set({ hasOnboarded: true }),
            resetOnboarding: () => set({ hasOnboarded: false }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
