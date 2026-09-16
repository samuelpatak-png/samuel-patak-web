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
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1e2420",
          color: "#efece1",
          padding: 56,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
          <span>SP-01</span>
          <span>list 1/1</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, marginBottom: 16 }}>Samuel Patak</div>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              lineHeight: 1.1,
              maxWidth: 860,
            }}
          >
            Stroj na dopyty. Diel si vyberiete na výkrese.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 18 }}>
          <span>AUT</span>
          <span>WDS</span>
          <span>WEB</span>
          <span>AIS</span>
          <span>ADS</span>
          <span>CRM</span>
          <span>LED</span>
        </div>
      </div>
    ),
    size,
  );
}
