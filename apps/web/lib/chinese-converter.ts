type ConverterFunction = (text: string) => string;

export type ConversionDirection = "toTraditional" | "toSimplified";
export type ChineseVariant = "standard" | "taiwan" | "hongkong";

// opencc-js 的地区变体 locale 码；"p" 后缀代表附带词汇层转换（如 软件→軟體），
// 标准繁体（standard）用 "t"（OpenCC 中间形式），不带地区词汇倾向。
const TRADITIONAL_LOCALE: Record<ChineseVariant, string> = {
  hongkong: "hkp",
  standard: "t",
  taiwan: "twp",
};

function resolveLocalePair(
  direction: ConversionDirection,
  variant: ChineseVariant,
): { from: string; to: string } {
  const traditional = TRADITIONAL_LOCALE[variant];
  return direction === "toTraditional"
    ? { from: "cn", to: traditional }
    : { from: traditional, to: "cn" };
}

// 按 from:to 缓存已构建的 converter，避免每次转换都重新加载词典/构建 Trie。
const converterCache = new Map<string, ConverterFunction>();

async function getConverter(
  from: string,
  to: string,
): Promise<ConverterFunction> {
  const cacheKey = `${from}:${to}`;
  const cached = converterCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  // opencc-js 词典体积较大，动态 import 让 bundler 单独分包，首屏零负载。
  const { Converter } = await import("opencc-js");
  const converter = Converter({ from, to });
  converterCache.set(cacheKey, converter);
  return converter;
}

export async function convertChineseText(
  text: string,
  direction: ConversionDirection,
  variant: ChineseVariant,
): Promise<string> {
  if (text === "") {
    return "";
  }
  const { from, to } = resolveLocalePair(direction, variant);
  const converter = await getConverter(from, to);
  return converter(text);
}
