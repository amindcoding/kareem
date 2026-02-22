'use client';

import { useState } from 'react';
import { useLocationStore } from '@/lib/stores/useLocationStore';
import { useProvinsi, useKabkota, useImsakiyah } from '@/services/imsakiyahHooks';
import { getTodayRamadanDay, getRamadanDate, getHariName, formatDateId } from '@/lib/ramadan';
import Link from 'next/link';
import { ChevronLeft, MapPin, Sunrise, Sun, Sunset, Moon, CloudMoon, Clock } from 'lucide-react';
import Image from 'next/image';

export default function JadwalPage() {
    const { provinsi, kabkota, setLocation } = useLocationStore();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedProvinsi, setSelectedProvinsi] = useState(provinsi);
    const [isProvinsiOpen, setIsProvinsiOpen] = useState(false);

    const { data: provinsiList } = useProvinsi();
    const { data: kabkotaList } = useKabkota(selectedProvinsi);
    const { data: imsakiyah, isLoading: imsakiyahLoading } = useImsakiyah(provinsi, kabkota);

    // Derive today's Ramadan day from API
    const todayTanggal = imsakiyah ? getTodayRamadanDay(imsakiyah.hijriah) : 0;

    const handleSelectKabkota = (kab: string) => {
        setLocation(selectedProvinsi, kab);
        setShowPicker(false);
        setIsProvinsiOpen(false); // reset state when picker closes
    };

    return (
        <div className="relative min-h-[100dvh] w-full">
            {/* Fixed Background Image with Dark Overlay */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/kaaba-bg.jpg"
                    alt="Kaaba Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px]"></div>
                {/* Gradient fade to black at bottom so last cards aren't hard to read */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 page-enter space-y-5 px-4 pb-24 pt-4">

                {/* Top Navigation - Floating & Sticky */}
                <div className="sticky top-4 z-50 flex items-center justify-between rounded-2xl bg-black/20 p-2 backdrop-blur-xl border border-white/10 shadow-lg">
                    <Link
                        href="/"
                        className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30 btn-press border border-white/20 shadow-sm"
                    >
                        <ChevronLeft size={16} />
                        Beranda
                    </Link>
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/30 btn-press border border-white/20 shadow-sm"
                    >
                        <MapPin size={14} />
                        {kabkota}
                    </button>
                </div>

                {/* Header Titles */}
                <div className="text-center pt-2 pb-2">
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">Jadwal Imsakiyah</h1>
                    <p className="text-sm text-gray-200 font-medium mt-1 drop-shadow-md">
                        Ramadhan {imsakiyah?.hijriah || ''}H / {imsakiyah?.masehi || ''}M
                    </p>
                </div>

                {/* Location Picker (Glassmorphism Modal style) */}
                {showPicker && (
                    <div className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-white/30 bg-gray-900/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-bold text-white">Pilih Lokasi</h3>
                            <button onClick={() => { setShowPicker(false); setIsProvinsiOpen(false); }} className="text-gray-400 hover:text-white transition-colors">✕</button>
                        </div>

                        {/* Province */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-400">Provinsi</label>

                            {/* Custom Dropdown Trigger */}
                            <button
                                onClick={() => setIsProvinsiOpen(!isProvinsiOpen)}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-base text-white outline-none focus:border-white/50 shadow-inner flex justify-between items-center btn-press"
                            >
                                <span>{selectedProvinsi || 'Pilih Provinsi...'}</span>
                                <span className={`text-gray-400 transition-transform ${isProvinsiOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {/* Custom Dropdown List */}
                            {isProvinsiOpen && provinsiList && (
                                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar mt-2 border border-white/10 bg-black/40 rounded-xl p-2">
                                    {provinsiList.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                setSelectedProvinsi(p);
                                                setIsProvinsiOpen(false); // Close list after selecting
                                            }}
                                            className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all btn-press ${p === selectedProvinsi ? 'bg-white/20 text-white font-semibold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* City - Shows only when a province is selected and province list is not open */}
                        {selectedProvinsi && kabkotaList && !isProvinsiOpen && (
                            <div className="space-y-1.5 pt-2 border-t border-white/10">
                                <label className="text-xs font-medium text-gray-400">Kabupaten / Kota</label>
                                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                    {kabkotaList.map((kab) => (
                                        <button
                                            key={kab}
                                            onClick={() => handleSelectKabkota(kab)}
                                            className={`w-full rounded-xl px-4 py-3 text-left text-base transition-all btn-press ${kab === kabkota
                                                ? 'bg-white/20 border border-white/30 text-white font-semibold shadow-sm'
                                                : 'text-gray-300 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            {kab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Imsakiyah Schedule Loading */}
                {imsakiyahLoading && (
                    <div className="space-y-4 pt-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-36 w-full animate-pulse rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg" />
                        ))}
                    </div>
                )}

                {/* Imsakiyah Grid List */}
                <div className="space-y-4 pt-2">
                    {imsakiyah?.imsakiyah.map((day) => {
                        const isToday = day.tanggal === todayTanggal;
                        const dayDate = getRamadanDate(imsakiyah.hijriah, day.tanggal);
                        const dayName = getHariName(dayDate);
                        const dateFormatted = formatDateId(dayDate);

                        return (
                            <div
                                key={day.tanggal}
                                className={`rounded-[32px] border p-5 backdrop-blur-md transition-all shadow-xl ${isToday
                                    ? 'border-white/50 bg-white/30 ring-1 ring-white/50'
                                    : 'border-white/20 bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/20">
                                    <h2 className={`text-xl font-bold tracking-tight ${isToday ? 'text-white drop-shadow-md' : 'text-gray-100'}`}>
                                        {day.tanggal} Ramadhan
                                    </h2>
                                    <span className={`text-sm ${isToday ? 'text-white font-semibold drop-shadow-md' : 'text-gray-300'}`}>
                                        {dayName}, {dateFormatted}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-y-6 gap-x-4 text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Clock size={18} className={isToday ? 'text-white' : 'text-gray-300'} />
                                        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Imsak</p>
                                        <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-100'}`}>{day.imsak}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <CloudMoon size={18} className={isToday ? 'text-white' : 'text-gray-300'} />
                                        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Subuh</p>
                                        <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-100'}`}>{day.subuh}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Sun size={18} className={isToday ? 'text-white' : 'text-gray-300'} />
                                        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Dzuhur</p>
                                        <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-100'}`}>{day.dzuhur}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Sunrise size={18} className={isToday ? 'text-white' : 'text-gray-300'} />
                                        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Ashar</p>
                                        <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-100'}`}>{day.ashar}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Sunset size={18} className={isToday ? 'text-white' : 'text-gray-300'} />
                                        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Maghrib</p>
                                        <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-100'}`}>{day.maghrib}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Moon size={18} className={isToday ? 'text-white' : 'text-gray-300'} />
                                        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Isya</p>
                                        <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-100'}`}>{day.isya}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
