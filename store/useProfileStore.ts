import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileState {
    displayName: string;
    bio: string;
    avatarUri: string | null;
    setProfile: (data: Partial<Omit<ProfileState, 'setProfile' | 'resetProfile'>>) => void;
    resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            displayName: 'Traveler',
            bio: 'Writing my journey...',
            avatarUri: null,
            setProfile: (data) => set((state) => ({ ...state, ...data })),
            resetProfile: () => set({ displayName: 'Traveler', bio: 'Writing my journey...', avatarUri: null }),
        }),
        {
            name: 'profile-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
