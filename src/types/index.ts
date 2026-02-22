// ── Habit Types ──────────────────────────────────────────
export interface Habit {
  id: string;
  name: string;
  icon: string;
  xp: number;
  category: 'wajib' | 'sunnah' | 'umum';
  isDefault: boolean;
}

export interface HabitLog {
  id?: number;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  xpEarned: number;
}

export interface CustomHabit {
  id?: number;
  name: string;
  icon: string;
  xp: number;
  category: 'wajib' | 'sunnah' | 'umum';
  createdAt: string;
}

// ── XP & Level ──────────────────────────────────────────
export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  minXP: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

// ── Quran Types (equran.id v2) ──────────────────────────
export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends Surah {
  ayat: Ayah[];
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string } | false;
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string } | false;
}

export interface Tafsir {
  ayat: number;
  teks: string;
}

export interface TafsirResponse {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tafsir: Tafsir[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ── Bookmark ────────────────────────────────────────────
export interface Bookmark {
  id?: number;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  teksArab: string;
  teksIndonesia: string;
  createdAt: string;
}

// ── Imsakiyah & Shalat ──────────────────────────────────
export interface ImsakiyahDay {
  tanggal: number;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface ImsakiyahResponse {
  provinsi: string;
  kabkota: string;
  hijriah: string;
  masehi: string;
  imsakiyah: ImsakiyahDay[];
}

export interface ShalatDay {
  tanggal: number;
  tanggal_lengkap: string;
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface ShalatResponse {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: ShalatDay[];
}

// ── Doa ─────────────────────────────────────────────────
export interface Doa {
  id: number;
  nama: string;
  ar: string;
  latin: string;
  idn: string;
  tentang: string;
  mood: string;
  tag: string[];
  grup: string;
}

// ── Vector Search ───────────────────────────────────────
export interface VectorResult {
  tipe: 'ayat' | 'tafsir' | 'surat' | 'doa';
  skor: number;
  relevansi: 'tinggi' | 'sedang' | 'rendah';
  data: {
    id_surat?: number;
    nama_surat?: string;
    nama_surat_arab?: string;
    nomor_ayat?: number;
    teks_arab?: string;
    teks_latin?: string;
    terjemahan_id?: string;
    isi?: string; // for tafsir
    // for doa
    doa?: string;
    artinya?: string;
    latin?: string;
  };
}

export interface VectorSearchResponse {
  status: string;
  cari: string;
  jumlah: number;
  hasil: VectorResult[];
}
