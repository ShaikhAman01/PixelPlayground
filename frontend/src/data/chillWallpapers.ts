export interface Wallpaper {
  id: string;
  name: string;
  url: string;
}

// All wallpapers are Unsplash photos (Unsplash License — free to use).
// Credited in the Credits modal.
export const CHILL_WALLPAPERS: Wallpaper[] = [
  { id: "starlit-peaks", name: "Starlit Peaks", url: "/chill/starlit-peaks.webp" },
  { id: "rainy-window", name: "Rain on the Window", url: "/chill/rainy-window.webp" },
  { id: "neon-breathe", name: "Neon Breathe", url: "/chill/neon-breathe.webp" },
  { id: "alpine-lakehouse", name: "Alpine Lakehouse", url: "/chill/alpine-lakehouse.webp" },
  { id: "lavender-dusk", name: "Lavender Dusk", url: "/chill/lavender-dusk.jpg" },
  { id: "forest-path", name: "Forest Path", url: "/chill/forest-path.jpg" },
  { id: "sunny-cat-nook", name: "Sunny Cat Nook", url: "/chill/sunny-cat-nook.webp" }
];
