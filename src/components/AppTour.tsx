'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function AppTour() {
    useEffect(() => {
        // Prevent running on SSR
        if (typeof window === 'undefined') return;

        // Check if user has already seen the tour
        const hasSeenTour = localStorage.getItem('kareem_tour_seen');
        if (hasSeenTour) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            doneBtnText: 'Mulai Ibadah ✨',
            nextBtnText: 'Lanjut ➔',
            prevBtnText: '⬅ Kembali',
            popoverClass: 'kareem-driver-theme',
            allowClose: false,
            steps: [
                {
                    popover: {
                        title: 'Selamat Datang di Kareem! 🌙',
                        description: 'Aplikasi pelacak ibadah Ramadan modern yang siap membantumu konsisten beribadah sebulan penuh. Mari kita lihat fitur-fiturnya sebentar!',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    element: '#tour-prayer-card',
                    popover: {
                        title: 'Jadwal Salat Cerdas',
                        description: 'Pantau terus waktu salat 5 waktu dan Imsak hari ini. Otomatis terkalibrasi dengan lokasimu lho!',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '#tour-xp-bar',
                    popover: {
                        title: 'Sistem Bar XP',
                        description: 'Selesaikan kebiasaan baik dan kumpulkan XP! Naikkan levelmu dari Benih hingga ke tingkat tertinggi.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '#tour-daily-summary',
                    popover: {
                        title: 'Ringkasan Ibadah Harian',
                        description: 'Lihat progres ibadahmu hari ini. Jangan lupa, pertahankan rekor streak harianmu agar apinya tidak padam! 🔥',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    element: '#tour-heatmap',
                    popover: {
                        title: 'Kalender Ramadan 30 Hari',
                        description: 'Warnai 30 hari Ramadan ini dengan amalan terbaikmu. Semakin banyak ibadah, semakin hijau kotaknya!',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    element: '#tour-bottom-nav',
                    popover: {
                        title: 'Navigasi Pintar',
                        description: 'Gunakan panel bawah ini untuk melompat ke fitur Tracker (catatan spesifik per hari), Al-Quran digital pintar, dan kumpulan Doa.',
                        side: 'top',
                        align: 'center'
                    }
                }
            ],
            onDestroyStarted: () => {
                if (!driverObj.hasNextStep() || confirm('Yakin ingin melewati tur panduan awal ini?')) {
                    localStorage.setItem('kareem_tour_seen', 'true');
                    driverObj.destroy();
                }
            },
        });

        const timer = setTimeout(() => {
            driverObj.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
