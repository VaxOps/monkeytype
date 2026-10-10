import { describe, expect, it } from "vitest";

import { parseVaxBannerMessages } from "../../vite-plugins/env-config";

describe("vax banner environment configuration", () => {
  it.each([undefined, "", "  "])(
    "uses the approved defaults for %s",
    (value) => {
      expect(parseVaxBannerMessages(value)).toEqual([
        "vax types faster than his shadow.",
        "the spacebar works overtime for vax.",
        "vax called. your keyboard wants a rematch.",
        "somewhere, vax just broke the sound barrier.",
        "this keyboard has been blessed by vax.",
      ]);
    },
  );

  it("accepts custom messages as plain text and trims whitespace", () => {
    expect(
      parseVaxBannerMessages('[" custom vax message ", "<b>vax</b>"]'),
    ).toEqual(["custom vax message", "<b>vax</b>"]);
  });

  it("accepts an empty list to disable banners", () => {
    expect(parseVaxBannerMessages("[]")).toEqual([]);
  });

  it.each([
    "invalid JSON",
    '"vax"',
    "null",
    "{}",
    "[1]",
    '[" "]',
    '["vax", null]',
  ])("rejects invalid configuration %s at build time", (value) => {
    expect(() => parseVaxBannerMessages(value)).toThrow(
      "VAX_BANNER_MESSAGES must be a JSON array of nonempty strings",
    );
  });
});
