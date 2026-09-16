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
          background: "#1e2420",
          color: "#efece1",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        SP
      </div>
    ),
    size,
  );
}
