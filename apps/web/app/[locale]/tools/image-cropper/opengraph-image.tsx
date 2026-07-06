import { ImageResponse } from "next/og";
import { getLocaleFromParams } from "@/lib/locale";
import { getLocaleContent } from "@/messages";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);

  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background:
          "radial-gradient(circle at top left, rgba(16,185,129,.24), transparent 30%), radial-gradient(circle at right, rgba(59,130,246,.2), transparent 35%), linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        color: "#0f172a",
        display: "flex",
        height: "100%",
        padding: 48,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(15,23,42,.08)",
          borderRadius: 32,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 40,
        }}
      >
        <div style={{ display: "flex", fontSize: 24, opacity: 0.7 }}>
          Meathill Tools
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {content.imageCropper.hero.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              maxWidth: 940,
              opacity: 0.82,
            }}
          >
            {content.imageCropper.hero.description}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
