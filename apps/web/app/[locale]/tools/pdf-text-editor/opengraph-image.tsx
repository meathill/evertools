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
          "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(243,197,116,.5) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 100%, rgba(251,241,216,.7) 0%, transparent 50%), linear-gradient(135deg, #fdfaf2 0%, #f6efde 100%)",
        color: "#3a2e23",
        display: "flex",
        height: "100%",
        padding: 48,
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#fdfaf2",
          border: "2px solid #3a2e23",
          borderRadius: 14,
          boxShadow: "0 5px 0 0 #3a2e23",
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
            {content.pdfTextEditor.hero.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              maxWidth: 940,
              opacity: 0.82,
            }}
          >
            {content.pdfTextEditor.hero.description}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
