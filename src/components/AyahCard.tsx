'use client';

import React, { useState, useEffect } from 'react';
import { Ayah } from '@/types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { Play, Pause, Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react';

let globalAudio: HTMLAudioElement | null = null;
let globalSetPlaying: ((val: boolean) => void) | null = null;

export const stopGlobalAudio = () => {
    if (globalAudio) {
        globalAudio.pause();
        if (globalSetPlaying) globalSetPlaying(false);
        globalAudio = null;
        globalSetPlaying = null;
    }
};

interface AyahCardProps {
    ayah: Ayah;
    surahId: number;
    surahName: string;
    isAutoPlayTarget?: boolean;
    onAudioPlay?: () => void;
    onAudioPause?: () => void;
    onAudioEnded?: () => void;
    onManualPlay?: () => void;
}

export default function AyahCard({
    ayah,
    surahId,
    surahName,
    isAutoPlayTarget,
    onAudioPlay,
    onAudioPause,
    onAudioEnded,
    onManualPlay
}: AyahCardProps) {
    const { showLatin, showTranslation, selectedQari } = useSettingsStore();
    const [isPlaying, setIsPlaying] = useState(false);

    // Reference needed for auto-scroll
    const cardRef = React.useRef<HTMLDivElement>(null);

    // Check if this ayah is bookmarked
    const bookmark = useLiveQuery(
        () =>
            db.bookmarks
                .where({ surahId, ayahNumber: ayah.nomorAyat })
                .first(),
        [surahId, ayah.nomorAyat]
    );

    const toggleBookmark = async () => {
        if (bookmark) {
            await db.bookmarks.delete(bookmark.id!);
        } else {
            await db.bookmarks.add({
                surahId,
                surahName,
                ayahNumber: ayah.nomorAyat,
                teksArab: ayah.teksArab,
                teksIndonesia: ayah.teksIndonesia,
                createdAt: new Date().toISOString(),
            });
        }
    };

    const playAudio = (isAutoPlay: boolean = false) => {
        const audioKeys = Object.keys(ayah.audio);
        if (audioKeys.length === 0) return;

        // If played manually, invoke the callback to stop global autoplay state
        if (!isAutoPlay && onManualPlay) onManualPlay();

        // Choose based on selected qari, fallback to the first one available
        const url = ayah.audio[selectedQari] || ayah.audio[audioKeys[0]];

        if (globalAudio) {
            // Auto pause if it's the exact same audio currently running
            if ((globalAudio.src === url || globalAudio.src.endsWith(url)) && isPlaying) {
                globalAudio.pause();
                setIsPlaying(false);
                if (globalSetPlaying) globalSetPlaying(false);
                if (onAudioPause) onAudioPause();
                return;
            }

            // Otherwise, pause the previous audio to start a new one
            globalAudio.pause();
            if (globalSetPlaying) globalSetPlaying(false);
        }

        const audio = new Audio(url);
        globalAudio = audio;
        globalSetPlaying = setIsPlaying;

        if (isAutoPlay && onAudioPlay) onAudioPlay();

        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
            setIsPlaying(false);
            if (globalAudio === audio) {
                globalAudio = null;
                globalSetPlaying = null;
            }
            if (isAutoPlay && onAudioEnded) onAudioEnded();
        };
        audio.onerror = () => {
            setIsPlaying(false);
            if (globalAudio === audio) {
                globalAudio = null;
                globalSetPlaying = null;
            }
            if (isAutoPlay && onAudioEnded) onAudioEnded(); // Skip broken audio
        };
        audio.play();
    };

    useEffect(() => {
        if (isAutoPlayTarget) {
            // Scroll to this card elegantly with offset for sticky header
            if (cardRef.current) {
                const yOffset = -300; // Offset to account for sticky header height
                const y = cardRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            if (!isPlaying) {
                playAudio(true); // pass true to indicate it's an auto-play trigger
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAutoPlayTarget]);

    return (
        <div ref={cardRef} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-all">
            {/* Ayah Number & Actions */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
                    {ayah.nomorAyat}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => playAudio(false)}
                        className={`rounded-lg p-2 transition-colors btn-press ${isPlaying
                            ? 'bg-primary-100 text-primary-600'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                        title="Putar audio"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                        onClick={toggleBookmark}
                        className={`rounded-lg p-2 transition-colors btn-press ${bookmark
                            ? 'bg-accent-100 text-accent-500'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                        title={bookmark ? 'Hapus bookmark' : 'Simpan bookmark'}
                    >
                        {bookmark ? <BookmarkCheck size={18} /> : <BookmarkIcon size={18} />}
                    </button>
                </div>
            </div>

            {/* Arabic Text */}
            <p className="mb-4 text-right font-arabic text-2xl leading-[2.2] text-gray-900">
                {ayah.teksArab}
            </p>

            {/* Latin transliteration */}
            {showLatin && (
                <p className="mb-2 text-sm italic leading-relaxed text-primary-600/70">
                    {ayah.teksLatin}
                </p>
            )}

            {/* Indonesian translation */}
            {showTranslation && (
                <p className="text-sm leading-relaxed text-gray-500">
                    {ayah.teksIndonesia}
                </p>
            )}
        </div>
    );
}
