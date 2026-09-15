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
          background: "#dce3ee",
          color: "#243040",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 220,
              height: 220,
              borderRadius: 110,
              background: "linear-gradient(145deg, #cfd6de, #5a6572)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 108,
                height: 108,
                borderRadius: 54,
                background: "#1c242e",
                color: "#f3efe4",
                fontSize: 40,
                fontWeight: 650,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              00
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 6,
              color: "#7a5a1c",
            }}
          >
            SP · 00
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              marginTop: 14,
              maxWidth: 760,
              textAlign: "center",
            }}
          >
            {SITE.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
