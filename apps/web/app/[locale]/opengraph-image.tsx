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
          "radial-gradient(circle at top left, rgba(59,130,246,.3), transparent 35%), linear-gradient(135deg, #020617 0%, #111827 55%, #1f2937 100%)",
        color: "#f8fafc",
        display: "flex",
        height: "100%",
        padding: 48,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 32,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 40,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, opacity: 0.8 }}>
          tools.meathill.com
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Meathill Tools
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              maxWidth: 900,
              opacity: 0.92,
            }}
          >
            {content.home.hero.title}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
