import Link from 'next/link';
import { Home, Compass } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 px-4 text-center page-enter">
            {/* Animated Illusion/Illustration */}
            <div className="relative flex h-48 w-48 items-center justify-center">
                {/* Background glow */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary-100/50 blur-3xl"></div>

                {/* Main Illustration Elements */}
                <div className="relative h-full w-full">
                    {/* The "404" numbers styled creatively */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 font-bold text-primary-600">
                        <span className="text-8xl drop-shadow-sm">4</span>
                        {/* The zero is replaced by the App Logo gently floating */}
                        <div className="relative mt-2 h-20 w-20 animate-[bounce_3s_ease-in-out_infinite] overflow-hidden rounded-full ring-4 ring-white shadow-lg">
                            <Image
                                src="/kareem-logo.png"
                                alt="Kareem App Logo"
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                                priority
                            />
                        </div>
                        <span className="text-8xl drop-shadow-sm">4</span>
                    </div>

                    {/* Cute floating stars/crescents around */}
                    <div className="absolute top-4 left-4 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] text-primary-300">✨</div>
                    <div className="absolute right-8 bottom-8 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] text-orange-300 delay-700">⭐</div>
                    <div className="absolute top-1/2 -right-4 animate-[bounce_5s_ease-in-out_infinite] text-primary-400 delay-1000">🌙</div>
                </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4 max-w-sm">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Waduh! Antarmuka Tersesat
                </h1>
                <p className="text-sm leading-relaxed text-gray-500">
                    Sepertinya Anda tiba di halaman yang belum terpetakan. Mungkin lantunan ayat atau catatan ibadahnya terbang terbawa angin padang pasir.
                </p>
            </div>

            {/* Actions */}
            <div className="flex w-full max-w-xs flex-col gap-3">
                <Link
                    href="/"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary-500/30 transition-all hover:bg-primary-700 active:scale-95"
                >
                    <Home size={18} />
                    Kembali ke Beranda
                </Link>
                <Link
                    href="/tracker"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-primary-600 shadow-sm border border-primary-100 transition-all hover:bg-primary-50 active:scale-95"
                >
                    <Compass size={18} />
                    Cari Catatan Ibadah
                </Link>
            </div>
        </div>
    );
}
