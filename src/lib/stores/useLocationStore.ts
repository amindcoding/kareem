import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
    provinsi: string;
    kabkota: string;
    setLocation: (provinsi: string, kabkota: string) => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            provinsi: 'DKI Jakarta',
            kabkota: 'Kota Jakarta',
            setLocation: (provinsi, kabkota) => set({ provinsi, kabkota }),
        }),
        {
            name: 'kareem-location',
        }
    )
);
