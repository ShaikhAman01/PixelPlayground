export interface Wallpaper {
  id: string;
  name: string;
  url: string;
}

export const CHILL_WALLPAPERS: Wallpaper[] = [
  { id: "attic-stars", name: "Starry Attic Studio", url: "/chill/starry-attic.jpg" },
  { id: "cozy-couch", name: "Lazy Cat Lounge", url: "/chill/wp11703003-cozy-lofi-wallpapers.jpg" },
  { id: "rainy-desk", name: "Late Night Coding", url: "/chill/wp11702888-cozy-lofi-wallpapers.jpg" },
  { id: "lakehouse", name: "Rainy Lakehouse", url: "/chill/wp10148832-lo-fi-autumn-wallpapers.jpg" },
  { id: "raccoon-bed", name: "Raccoon Dreamer", url: "/chill/wp9183743-lofi-music-wallpapers.jpg" },
  { id: "critter-cafe", name: "Critter Café", url: "/chill/critter-cafe.jpg" }
];
