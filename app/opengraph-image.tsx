import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          backgroundColor: "#FBF6EC",
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            color: "#7A3E1D",
            fontFamily: "Georgia, serif",
          }}
        >
          DatesCrunch
        </div>
        <div style={{ fontSize: 32, color: "#8A7B6C", marginTop: 16 }}>
          Premium Dates &amp; Dry Fruits
        </div>
      </div>
    ),
    { ...size }
  );
}
