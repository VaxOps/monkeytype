import { afterEach, describe, expect, it, vi } from "vitest";
import { envConfig } from "virtual:env-config";

import { practiceBannerMessages } from "../../src/ts/constants/practice-banner-messages";
import { getBanners, removeBanner } from "../../src/ts/states/banners";
import { show } from "../../src/ts/elements/vax-banner";

describe("persistent practice banner", () => {
  afterEach(() => {
    for (const banner of [...getBanners()]) removeBanner(banner.id);
    vi.restoreAllMocks();
  });

  it("has 21 unique defaults, excludes removed sentence 15 and keeps vax in its configured pool", () => {
    const messages = [
      ...practiceBannerMessages,
      ...envConfig.vaxBannerMessages,
    ];
    expect(practiceBannerMessages).toHaveLength(16);
    expect(messages).toHaveLength(21);
    expect(new Set(messages).size).toBe(21);
    expect(messages).not.toContain("accuracy first. blaming dns second.");
    expect(
      practiceBannerMessages.every((message) => !message.includes("vax")),
    ).toBe(true);
  });

  it.each(Array.from({ length: 21 }, (_, index) => index))(
    "always shows selectable message %s without a close button",
    (index) => {
      const messages = [
        ...practiceBannerMessages,
        ...envConfig.vaxBannerMessages,
      ];
      vi.spyOn(Math, "random").mockReturnValue((index + 0.5) / messages.length);
      show();
      expect(getBanners()).toHaveLength(1);
      expect(getBanners()[0]).toMatchObject({
        level: "success",
        important: true,
        text: messages[index],
      });
    },
  );

  it.each([0, 0.1, 0.999999])("always shows a message for roll %s", (roll) => {
    vi.spyOn(Math, "random").mockReturnValue(roll);
    show();
    expect(getBanners()).toHaveLength(1);
    expect(getBanners()[0]?.text).not.toBe("");
  });

  it("includes custom environment messages; an empty vax list retains practice messages", () => {
    const originalMessages = envConfig.vaxBannerMessages;
    try {
      envConfig.vaxBannerMessages = ["custom vax message"];
      vi.spyOn(Math, "random").mockReturnValue(0.999999);
      show();
      expect(getBanners()[0]?.text).toBe("custom vax message");
      for (const banner of [...getBanners()]) removeBanner(banner.id);
      envConfig.vaxBannerMessages = [];
      show();
      expect(getBanners()[0]?.text).toBe(practiceBannerMessages.at(-1));
    } finally {
      envConfig.vaxBannerMessages = originalMessages;
    }
  });
});
