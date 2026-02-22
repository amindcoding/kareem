'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckCircle2, BookOpen, HeartHandshake } from 'lucide-react';

const tabs = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/tracker', label: 'Tracker', icon: CheckCircle2 },
    { href: '/quran', label: 'Quran', icon: BookOpen },
    { href: '/doa', label: 'Doa', icon: HeartHandshake },
];

export default function BottomNav() {
    const pathname = usePathname();

    if (pathname === '/jadwal') return null;

    return (
        <nav id="tour-bottom-nav" className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-[400px] -translate-x-1/2 rounded-3xl border border-white/40 bg-white/80 p-2 text-gray-600 shadow-navbar backdrop-blur-xl">
            <div className="flex items-center justify-around">
                {tabs.map((tab) => {
                    const isActive =
                        pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`relative flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-[10px] font-medium transition-all duration-300 btn-press ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${isActive ? 'bg-primary-50 text-primary-600' : 'bg-transparent text-gray-500'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={isActive ? 'font-bold' : ''}>{tab.label}</span>
                            {isActive && (
                                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-600" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
