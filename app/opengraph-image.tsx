import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#171b21",
          color: "#c9d0d8",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 640,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#c6a45e",
            }}
          >
            Samuel Patak · freelancer
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.05,
              color: "#e7dcc8",
              maxWidth: 620,
            }}
          >
            Natočte trezor. Vnútri je presne to, čo hľadáte.
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#a8b1bc" }}>
            Dizajn · stavba webu · reklamy
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 90,
            width: 360,
            height: 360,
            borderRadius: 180,
            background: "#c6a45e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 150,
              background: "#140f11",
              color: "#ead7a2",
              fontSize: 88,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            00
          </div>
        </div>
      </div>
    ),
    size,
  );
}
