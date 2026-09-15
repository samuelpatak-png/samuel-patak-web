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
          alignItems: "center",
          justifyContent: "center",
          background: "#e6ebf3",
          color: "#2a3443",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 220,
              height: 220,
              borderRadius: 110,
              background: "#e6ebf3",
              boxShadow: "12px 12px 24px #c3cedc, -12px -12px 24px #ffffff",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 650,
              }}
            >
              00
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#4d6a8a",
            }}
          >
            Samuel Patak · freelancer
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              lineHeight: 1.1,
              marginTop: 16,
              maxWidth: 820,
            }}
          >
            Natočte trezor. Vnútri je presne to, čo hľadáte.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
