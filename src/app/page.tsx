'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useTrackerStore } from '@/lib/stores/useTrackerStore';
import { DEFAULT_HABITS } from '@/lib/constants';
import XPBar from '@/components/XPBar';
import RamadanHeatmap from '@/components/RamadanHeatmap';
import AppTour from '@/components/AppTour';
import Link from 'next/link';
import { useLocationStore } from '@/lib/stores/useLocationStore';
import { useImsakiyah } from '@/services/imsakiyahHooks';
import { getTodayRamadanDay, getHariName, getRamadanDate, formatDateId } from '@/lib/ramadan';
import type { ImsakiyahDay } from '@/types';
import toast from 'react-hot-toast';

// ── Prayer schedule helper ──────────────────────────────
interface PrayerTime {
  label: string;
  time: string;
  minutes: number; // minutes since midnight
}

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function getPrayerTimes(schedule: ImsakiyahDay): PrayerTime[] {
  return [
    { label: 'Imsak', time: schedule.imsak, minutes: parseTime(schedule.imsak) },
    { label: 'Subuh', time: schedule.subuh, minutes: parseTime(schedule.subuh) },
    { label: 'Terbit', time: schedule.terbit, minutes: parseTime(schedule.terbit) },
    { label: 'Dhuha', time: schedule.dhuha, minutes: parseTime(schedule.dhuha) },
    { label: 'Dzuhur', time: schedule.dzuhur, minutes: parseTime(schedule.dzuhur) },
    { label: 'Ashar', time: schedule.ashar, minutes: parseTime(schedule.ashar) },
    { label: 'Maghrib', time: schedule.maghrib, minutes: parseTime(schedule.maghrib) },
    { label: 'Isya', time: schedule.isya, minutes: parseTime(schedule.isya) },
  ];
}



function formatCountdown(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} menit`;
  return `${h}j ${m}m`;
}

export default function DashboardPage() {
  const { provinsi, kabkota } = useLocationStore();
  const { todayLogs, totalXP, todayXP, streak, isLoaded, loadToday, customHabits } =
    useTrackerStore();

  const { data: imsakiyah } = useImsakiyah(provinsi, kabkota);

  // Derive today's Ramadan day from API's hijriah year
  const todayTanggal = imsakiyah ? getTodayRamadanDay(imsakiyah.hijriah) : 0;
  const todaySchedule = imsakiyah?.imsakiyah.find((d) => d.tanggal === todayTanggal);
  const tomorrowSchedule = imsakiyah?.imsakiyah.find((d) => d.tanggal === todayTanggal + 1);

  // Today's date info
  const todayDate = imsakiyah ? getRamadanDate(imsakiyah.hijriah, todayTanggal) : new Date();
  const todayHari = getHariName(todayDate);
  const todayFormatted = formatDateId(todayDate);

  // Prayer countdown — stores current time as minutes, polls every 15s
  const prayers = useMemo(() => todaySchedule ? getPrayerTimes(todaySchedule) : [], [todaySchedule]);

  const getNowMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const [nowMinutes, setNowMinutes] = useState(getNowMinutes);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMinutes(getNowMinutes());
    }, 15000); // check every 15s so we never miss a minute change
    return () => clearInterval(interval);
  }, []);

  // Derive next prayer from current time — recomputes whenever nowMinutes changes
  const nextPrayer = useMemo(() => {
    if (prayers.length === 0) return null;
    for (const p of prayers) {
      if (p.minutes > nowMinutes) {
        return { next: p, remainingMin: p.minutes - nowMinutes };
      }
    }

    // If today's prayers are all finished, show tomorrow's Imsak
    if (tomorrowSchedule) {
      const tomorrowImsakMins = parseTime(tomorrowSchedule.imsak);
      return {
        next: { label: 'Imsak (Besok)', time: tomorrowSchedule.imsak, minutes: tomorrowImsakMins },
        remainingMin: (24 * 60 - nowMinutes) + tomorrowImsakMins
      };
    }

    return null;
  }, [prayers, nowMinutes, tomorrowSchedule]);

  // Prayer reminder toast (< 30 mins)
  const notifiedPrayerRef = useRef<string | null>(null);

  useEffect(() => {
    if (nextPrayer && nextPrayer.remainingMin <= 30 && nextPrayer.remainingMin > 0) {
      if (notifiedPrayerRef.current !== nextPrayer.next.label) {
        toast(
          (t) => (
            <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer text-white font-semibold">
              {nextPrayer.next.label === 'Terbit'
                ? `Matahari terbit (akhir waktu Subuh) tinggal ${nextPrayer.remainingMin} menit lagi! 🌅`
                : `Waktu ${nextPrayer.next.label} tinggal ${nextPrayer.remainingMin} menit lagi! Yuk siap-siap 🕌`}
            </span>
          ),
          {
            id: `prayer-reminder-${nextPrayer.next.label}`,
            icon: '⌛',
            duration: 6000,
            style: {
              background: '#16a34a',
              color: '#fff',
              padding: '12px',
              fontSize: '14px',
            },
          }
        );
        notifiedPrayerRef.current = nextPrayer.next.label;
      }
    } else if (nextPrayer && nextPrayer.remainingMin > 30) {
      // Reset when a new prayer is more than 30 mins away
      notifiedPrayerRef.current = null;
    }
  }, [nextPrayer]);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  // Calculate today's completion (default + custom habits)
  const showRemaningCount = 2
  const allHabitIds = [
    ...DEFAULT_HABITS.map((h) => h.id),
    ...customHabits.map((h) => `custom-${h.id}`),
  ];
  const completedCount = allHabitIds.filter((id) => todayLogs[id]).length;
  const completionPct =
    allHabitIds.length > 0
      ? Math.round((completedCount / allHabitIds.length) * 100)
      : 0;

  if (!isLoaded) {
    return (
      <div className="page-enter space-y-4 px-4 pt-6">
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="page-enter space-y-5 px-4 pt-6">
      <AppTour />
      {/* ── Header with countdown ── */}
      <div className="rounded-2xl gradient-hero p-5 flex justify-between items-start gap-2">
        <div>
          <p className="text-sm text-gray-500">Assalamu&apos;alaykum 🙏🏻</p>
          {todayTanggal > 0 && todayTanggal <= 30 && (
            <p className="text-xs text-primary-600 font-medium mt-1">
              🌙 {todayTanggal} Ramadhan {imsakiyah?.hijriah}H
            </p>
          )}
        </div>
        {nextPrayer && (
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <span className="text-lg">🕌</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {nextPrayer.next.label === 'Terbit' ? 'Matahari Terbit' : nextPrayer.next.label}
              </p>
              <p className="text-xs text-primary-600 font-medium">
                dalam {formatCountdown(nextPrayer.remainingMin)}
              </p>
            </div>
          </div>
        )}
        {!nextPrayer && todaySchedule && (
          <p className="mt-2 text-xs text-gray-400">Semua waktu shalat hari ini telah berlalu</p>
        )}
      </div>

      {/* ── Today's Prayer Card (brighter) ── */}
      {todaySchedule && (
        <div id="tour-prayer-card" className="rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-5 text-white shadow-lg ring-1 ring-primary-500/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-white/90">
              📍 {kabkota} · {todayHari}, {todayFormatted}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Imsak', time: todaySchedule.imsak },
              { label: 'Subuh', time: todaySchedule.subuh },
              { label: 'Terbit', time: todaySchedule.terbit },
              { label: 'Dhuha', time: todaySchedule.dhuha },
              { label: 'Dzuhur', time: todaySchedule.dzuhur },
              { label: 'Ashar', time: todaySchedule.ashar },
              { label: 'Maghrib', time: todaySchedule.maghrib },
              { label: 'Isya', time: todaySchedule.isya },
            ].map(({ label, time }) => {
              const isNext = nextPrayer?.next.label === label;
              return (
                <div key={label} className={`rounded-lg py-1 transition-all ${isNext ? 'bg-white/20 scale-105' : ''}`}>
                  <p className={`text-base font-bold ${isNext ? 'text-white' : 'text-white/95'}`}>{time}</p>
                  <p className={`text-[10px] ${isNext ? 'text-white font-semibold' : 'text-white/80'}`}>{label}</p>
                </div>
              );
            })}
          </div>
          <Link
            href="/jadwal"
            className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/30 btn-press"
          >
            Lihat Jadwal Lengkap →
          </Link>
        </div>
      )}

      {/* ── XP Bar (clickable → /progress) ── */}
      <Link href="/progress" className="block" id="tour-xp-bar">
        <XPBar totalXP={totalXP} />
      </Link>

      {/* ── Today's Summary — Duolingo style with streak overlay ── */}
      <div id="tour-daily-summary" className="relative rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 shadow-card overflow-visible">
        {/* Streak badge — overlaid top-right, clickable */}
        <button
          onClick={() => {
            toast.success(
              (t) => (
                <span onClick={() => toast.dismiss(t.id)} className="cursor-pointer">
                  Streak {streak.current} hari! Kamu sudah konsisten beribadah {streak.current} hari berturut-turut. Semangat istiqomah!
                </span>
              ),
              {
                id: 'streak-toast',
                icon: '🔥',
                duration: 6000,
                style: {
                  background: '#f97316',
                  color: '#fff',
                },
              }
            );
          }}
          className="absolute -top-3 -right-2 flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1 shadow-md animate-bounce-once btn-press cursor-pointer"
        >
          <span className="text-sm">🔥</span>
          <span className="text-sm font-bold text-white">{streak.current}</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Ibadah Hari Ini
              <span className="ml-2 text-xs font-medium text-accent-500">+{todayXP} XP</span>
            </p>
            <p className="text-3xl font-bold text-primary-600">
              {completedCount}
              <span className="text-lg text-gray-400">
                /{allHabitIds.length}
              </span>
            </p>
          </div>
          {/* Circular progress — Duolingo ring */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#dcfce7"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${completionPct * 1.76} 176`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-sm font-bold text-primary-600">
              {completionPct}%
            </span>
          </div>
        </div>

        {/* Motivational text */}
        <p className="mt-3 text-xs font-semibold text-primary-700">
          {completionPct === 0 && '💪 Yuk mulai ibadahmu hari ini!'}
          {completionPct > 0 && completionPct <= 25 && '🌱 Baru mulai, semangat!'}
          {completionPct > 25 && completionPct <= 50 && '🌿 Terus lanjutkan, kamu hebat!'}
          {completionPct > 50 && completionPct <= 75 && '🌳 Hampir selesai, jangan berhenti!'}
          {completionPct > 75 && completionPct < 100 && '🌟 Sedikit lagi, ayo selesaikan!'}
          {completionPct === 100 && '🏆 Masyaa Allah, luar biasa!'}
        </p>

        {/* Remaining habits */}
        {completionPct < 100 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...DEFAULT_HABITS, ...customHabits.map((h) => ({ id: `custom-${h.id}`, name: h.name, icon: h.icon }))]
              .filter((h) => !todayLogs[h.id])
              .slice(0, showRemaningCount)
              .map((h) => (
                <Link href="/tracker" key={h.id} className="block">
                  <span
                    className="inline-flex items-center gap-1 rounded-lg bg-white/80 border border-gray-100 px-2 py-0.5 text-[10px] text-gray-500"
                  >
                    <span>{h.icon}</span>
                    {h.name}
                  </span>
                </Link>
              ))}
            {[...DEFAULT_HABITS, ...customHabits.map((h) => ({ id: `custom-${h.id}`, name: h.name, icon: h.icon }))]
              .filter((h) => !todayLogs[h.id]).length > showRemaningCount && (
                <Link href="/tracker" className="block">
                  <span className="inline-flex items-center rounded-lg bg-gray-50 px-2 py-0.5 text-[10px] text-gray-400">
                    +{[...DEFAULT_HABITS, ...customHabits.map((h) => ({ id: `custom-${h.id}`, name: h.name, icon: h.icon }))]
                      .filter((h) => !todayLogs[h.id]).length - showRemaningCount} lagi
                  </span>
                </Link>
              )}
          </div>
        )}
      </div>

      {/* ── Ramadan Heatmap ── */}
      {imsakiyah && (
        <div id="tour-heatmap">
          <RamadanHeatmap hijriah={imsakiyah.hijriah} todayTanggal={todayTanggal} />
        </div>
      )}

      {/* ── Footer ── */}
      <div className="pt-4 text-center">
        <p className="text-[10px] text-gray-400 font-medium">
          Made with ❤️ •{' '}
          <Link href="/about" className="text-primary-600 hover:underline">
            Tentang Aplikasi
          </Link>
        </p>
      </div>

    </div>
  );
}
