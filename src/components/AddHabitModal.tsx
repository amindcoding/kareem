'use client';

import { useState } from 'react';
import { useTrackerStore } from '@/lib/stores/useTrackerStore';

export default function AddHabitModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [category, setCategory] = useState<'wajib' | 'sunnah' | 'umum'>('umum');
    const { addCustomHabit } = useTrackerStore();

    const icons = ['⭐', '🤲', '📚', '💪', '🧘', '❤️', '🎯', '📝', '🌙', '✨'];

    const handleAdd = async () => {
        if (!name.trim()) return;
        await addCustomHabit(name.trim(), icon, category);
        setName('');
        setIcon('⭐');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 p-4 text-sm text-gray-400 transition-colors hover:border-primary-400 hover:text-primary-600 btn-press"
            >
                <span className="text-lg">+</span>
                Tambah Ibadah Kustom
            </button>
        );
    }

    return (
        <div className="rounded-2xl border border-primary-200 bg-white p-4 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Tambah Ibadah Baru</h3>

            {/* Name */}
            <input
                type="text"
                placeholder="Nama ibadah..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
            />

            {/* Icon picker */}
            <div className="mb-3">
                <label className="mb-1.5 block text-xs font-medium text-gray-500">Pilih Icon (atau ketik emoji)</label>
                <div className="flex items-start gap-3">
                    <input
                        type="text"
                        maxLength={2}
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border-none bg-primary-50 text-center text-xl outline-none ring-1 ring-primary-200 focus:ring-2 focus:ring-primary-400"
                    />
                    <div className="flex flex-1 flex-wrap gap-1.5">
                        {icons.map((i) => (
                            <button
                                key={i}
                                onClick={() => setIcon(i)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition-all ${icon === i
                                    ? 'bg-primary-100 ring-2 ring-primary-400'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category */}
            <div className="mb-4 flex gap-2">
                {(['wajib', 'sunnah', 'umum'] as const).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${category === cat
                            ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Batal
                </button>
                <button
                    onClick={handleAdd}
                    disabled={!name.trim()}
                    className="flex-1 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500 disabled:opacity-40"
                >
                    Tambah
                </button>
            </div>
        </div>
    );
}
