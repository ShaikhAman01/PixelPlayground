export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  url: string;
}

export const lofiPlaylist: Track[] = [
  {
    id: "lofi-1",
    title: "Midnight Coffee",
    artist: "Lofi Study Beats",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=60",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Production fallback stream
  },
  {
    id: "lofi-2",
    title: "Rainy Desktop",
    artist: "Chillhop Workspace",
    albumArt: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=120&auto=format&fit=crop&q=60",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "lofi-3",
    title: "Code & Chill",
    artist: "Pixel Playground Station",
    albumArt: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=120&auto=format&fit=crop&q=60",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];