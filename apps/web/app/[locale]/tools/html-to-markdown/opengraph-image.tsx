import { ImageResponse } from "next/og";
import { getLocaleFromParams } from "@/lib/locale";
import { getLocaleContent } from "@/messages";

export const size = {
  height: 630,
  width: 1200,
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
          "radial-gradient(circle at top left, rgba(230,195,74,.3), transparent 32%), radial-gradient(circle at right, rgba(243,197,116,.24), transparent 36%), linear-gradient(135deg, #fdfaf2 0%, #f6efde 100%)",
        color: "#3a2e23",
        display: "flex",
        height: "100%",
        padding: 48,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid rgba(58,46,35,.16)",
          borderRadius: 24,
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
            {content.htmlToMarkdown.hero.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              maxWidth: 940,
              opacity: 0.82,
            }}
          >
            {content.htmlToMarkdown.hero.description}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
