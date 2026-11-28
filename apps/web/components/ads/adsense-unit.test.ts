// @vitest-environment jsdom
import { render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AdSenseUnit } from "@/components/ads/adsense-unit";

function getQueue(): unknown[] {
  return (window as { adsbygoogle?: unknown[] }).adsbygoogle ?? [];
}

beforeEach(() => {
  delete (window as { adsbygoogle?: unknown[] }).adsbygoogle;
});

afterEach(() => {
  delete (window as { adsbygoogle?: unknown[] }).adsbygoogle;
});

describe("AdSenseUnit", () => {
  it("renders nothing and reserves no space when slot is not configured", () => {
    const { container } = render(
      React.createElement(AdSenseUnit, { slotId: undefined }),
    );

    expect(container.querySelector("ins.adsbygoogle")).toBeNull();
    expect(container.childElementCount).toBe(0);
  });

  it("renders a fixed-size ins with slot id and reserves space upfront", () => {
    const { container } = render(
      React.createElement(AdSenseUnit, { slotId: "1234567890" }),
    );

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).not.toBeNull();
    expect(ins?.getAttribute("data-ad-slot")).toBe("1234567890");
    // SSR HTML 里就有精确占位，填充时不产生布局位移
    expect(ins?.getAttribute("style")).toContain("width: 336px");
    expect(ins?.getAttribute("style")).toContain("height: 280px");
  });

  it("queues the adsbygoogle push on mount", () => {
    render(React.createElement(AdSenseUnit, { slotId: "1234567890" }));

    // adsbygoogle.js 是 lazyOnload，push 先进队列
    expect(getQueue()).toHaveLength(1);
  });

  it("does not push when slot is not configured", () => {
    (window as { adsbygoogle?: unknown[] }).adsbygoogle = [];

    render(React.createElement(AdSenseUnit, { slotId: undefined }));

    expect(getQueue()).toHaveLength(0);
  });
});
