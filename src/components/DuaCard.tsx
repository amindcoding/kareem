'use client';

import { useState } from 'react';
import { Doa } from '@/types';

interface DuaCardProps {
    doa: Doa;
}

export default function DuaCard({ doa }: DuaCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left btn-press"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{doa.nama}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {/* <span className="rounded-md bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary-600">
                                {doa.grup}
                            </span> */}
                            {/* {doa.tag && doa?.tag?.map((tag) => (
                                <span
                                    key={tag.trim()}
                                    className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500"
                                >
                                    {tag.trim()}
                                </span>
                            ))} */}
                        </div>
                    </div>
                    <span className={`text-gray-400 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </div>
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="mt-4 space-y-3 animate-in">
                    {/* Arabic */}
                    {doa?.ar && (
                        <p className="text-right font-arabic text-xl leading-[2] text-gray-900">
                            {doa?.ar}
                        </p>
                    )}

                    {/* Latin */}
                    {doa.latin && (
                        <p className="text-sm italic leading-relaxed text-primary-600/70">
                            {doa.latin}
                        </p>
                    )}

                    {/* Meaning */}
                    <p className="text-sm leading-relaxed text-gray-600">
                        <span className="font-semibold text-gray-700">Artinya: </span>
                        {doa?.idn}
                    </p>

                    {/* About */}
                    {doa.tentang && (
                        <div className="rounded-xl bg-gray-50 p-3 overflow-hidden">
                            <p className="text-xs text-gray-500 whitespace-pre-wrap break-words">{doa.tentang}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
