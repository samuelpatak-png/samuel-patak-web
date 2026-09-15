import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b2028",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            background: "#c6a45e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 8,
              background: "#140f11",
              color: "#ead7a2",
              fontSize: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            SP
          </div>
        </div>
      </div>
    ),
    size,
  );
}
