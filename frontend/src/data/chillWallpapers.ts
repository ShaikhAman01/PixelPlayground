export interface Wallpaper {
  id: string;
  name: string;
  url: string;
}

// All wallpapers are Unsplash photos (Unsplash License — free to use).
// Credited in the Credits modal.
export const CHILL_WALLPAPERS: Wallpaper[] = [
  { id: "starlit-peaks", name: "Starlit Peaks", url: "/chill/starlit-peaks.jpg" },
  { id: "rainy-window", name: "Rain on the Window", url: "/chill/rainy-window.jpg" },
  { id: "neon-breathe", name: "Neon Breathe", url: "/chill/neon-breathe.jpg" },
  { id: "alpine-lakehouse", name: "Alpine Lakehouse", url: "/chill/alpine-lakehouse.jpg" },
  { id: "lavender-dusk", name: "Lavender Dusk", url: "/chill/lavender-dusk.jpg" },
  { id: "forest-path", name: "Forest Path", url: "/chill/forest-path.jpg" },
  { id: "sunny-cat-nook", name: "Sunny Cat Nook", url: "/chill/sunny-cat-nook.jpg" }
];
