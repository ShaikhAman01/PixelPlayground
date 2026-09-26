import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/links";

export const alt = `${SITE_NAME}, a cozy lofi browser arcade`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GAMES = ["2048", "Wordle", "Connect 4", "Tic Tac Toe", "Slide Puzzle", "Color Memory"];

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(150deg, #1a1050 0%, #090541 55%, #2b1f6e 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          padding: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solid rgba(255,255,255,0.14)",
            borderRadius: 40,
            background: "rgba(255,255,255,0.06)",
            padding: "40px 56px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#b7aef5",
            }}
          >
            Cozy Browser Arcade
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              marginTop: 14,
            }}
          >
            <div style={{ display: "flex" }}>PIXEL</div>
            <div style={{ display: "flex" }}>PLAYGROUND</div>
          </div>

          <div style={{ fontSize: 26, color: "#cdc7f7", marginTop: 18 }}>
            Six games, leaderboards, streaks and lofi.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
            {GAMES.map((game) => (
              <div
                key={game}
                style={{
                  display: "flex",
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#e9e6ff",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(143,134,234,0.18)",
                  borderRadius: 999,
                  padding: "7px 16px",
                }}
              >
                {game}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 20, color: "#9a91e0", marginTop: 26, letterSpacing: 2 }}>
          pixelplayground.shaikhaman.in
        </div>
      </div>
    ),
    { ...size }
  );
}
