import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TrackType {
  title: string;
  artist: string;
  src: string;
  fallbackSrc: string;
  albumArt: string;
  creditUrl: string;
  license: string;
  source: string;
}

export const playlist: TrackType[] = [
  {
    title: "Good Night - Lofi Cozy Chill Music",
    artist: "FASSounds",
    src: "/music/cozy-lofi.mp3",
    fallbackSrc: "/music/cozy-lofi.mp3",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://pixabay.com/users/fassounds-3433550/",
    license: "Pixabay Content License (ID: 160166)",
    source: "Pixabay"
  },
  {
    title: "Transcendence",
    artist: "Alexander Nakarada",
    src: "/music/Transcendence-chosic.com_.mp3",
    fallbackSrc: "/music/Transcendence-chosic.com_.mp3",
    albumArt: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://creatorchords.com",
    license: "Creative Commons CC BY 4.0",
    source: "Chosic"
  },
  {
    title: "Bedtime After A Coffee",
    artist: "Barradeen",
    src: "/music/barradeen-bedtime-after-a-coffee(chosic.com).mp3",
    fallbackSrc: "/music/barradeen-bedtime-after-a-coffee(chosic.com).mp3",
    albumArt: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://www.chosic.com/artist/barradeen/",
    license: "Creative Commons CC BY 3.0",
    source: "Chosic"
  },
  {
    title: "Colorful Flowers",
    artist: "Tokyo Music Walker",
    src: "/music/Colorful-Flowers(chosic.com).mp3",
    fallbackSrc: "/music/Colorful-Flowers(chosic.com).mp3",
    albumArt: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://www.chosic.com/free-music/all/",
    license: "Creative Commons CC BY 3.0",
    source: "Chosic"
  },
  {
    title: "Lofi Study Calm Peaceful",
    artist: "FASSounds",
    src: "/music/fassounds-lofi-study-calm... eful-chill-hop-112191.mp3",
    fallbackSrc: "/music/fassounds-lofi-study-calm... eful-chill-hop-112191.mp3",
    albumArt: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://pixabay.com/users/fassounds-3433550/",
    license: "Pixabay License",
    source: "Pixabay"
  },
  {
    title: "Coffee Lofi Ambient",
    artist: "Lofi Music Library",
    src: "/music/lofi_music_library-coffee-l... -lofi-ambient-458901.mp3",
    fallbackSrc: "/music/lofi_music_library-coffee-l... -lofi-ambient-458901.mp3",
    albumArt: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://pixabay.com/music/search/lofi/",
    license: "Pixabay License",
    source: "Pixabay"
  },
  {
    title: "Magical Moments",
    artist: "Chosic Ambient",
    src: "/music/Magical-Moments-chosic.com_.mp3",
    fallbackSrc: "/music/Magical-Moments-chosic.com_.mp3",
    albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://www.chosic.com/free-music/all/",
    license: "Creative Commons CC BY 4.0",
    source: "Chosic"
  },
  {
    title: "Lofi Chill",
    artist: "Nastelbom",
    src: "/music/nastelbom-lofi-chill-372954.mp3",
    fallbackSrc: "/music/nastelbom-lofi-chill-372954.mp3",
    albumArt: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://pixabay.com/users/nastelbom-24750242/",
    license: "Pixabay License",
    source: "Pixabay"
  },
  {
    title: "Lofi Beats",
    artist: "PrettyJohn1",
    src: "/music/prettyjohn1-lofi-beats-524251.mp3",
    fallbackSrc: "/music/prettyjohn1-lofi-beats-524251.mp3",
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://pixabay.com/users/prettyjohn1-41221191/",
    license: "Pixabay License",
    source: "Pixabay"
  },
  {
    title: "Lofi Lofi Music",
    artist: "PrettyJohn1",
    src: "/music/prettyjohn1-lofi-lofi-music-525021.mp3",
    fallbackSrc: "/music/prettyjohn1-lofi-lofi-music-525021.mp3",
    albumArt: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=120&auto=format&fit=crop&q=60",
    creditUrl: "https://pixabay.com/users/prettyjohn1-41221191/",
    license: "Pixabay License",
    source: "Pixabay"
  }
];

interface AudioState {
  volume: number;
  trackIndex: number;
  isPlaying: boolean;
  setVolume: (vol: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      volume: 35,
      trackIndex: 0,
      isPlaying: false,
      setVolume: (volume) => set({ volume: Math.min(Math.max(volume, 0), 100) }),
      nextTrack: () => set((state) => ({ trackIndex: (state.trackIndex + 1) % playlist.length })),
      prevTrack: () => set((state) => ({ trackIndex: state.trackIndex === 0 ? playlist.length - 1 : state.trackIndex - 1 })),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
    }),
    { name: "pixel-playground-audio-sync" }
  )
);