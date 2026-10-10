import { afterEach, describe, expect, it, vi } from "vitest";
import { envConfig } from "virtual:env-config";

import { getBanners, removeBanner } from "../../src/ts/states/banners";
import { show } from "../../src/ts/elements/vax-banner";

describe("vax top banner", () => {
  afterEach(() => {
    for (const banner of [...getBanners()]) removeBanner(banner.id);
    vi.restoreAllMocks();
  });

  it("shows the dismissible accent strip below the ten percent boundary", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.099999)
      .mockReturnValueOnce(0);
    show();
    expect(getBanners()).toHaveLength(1);
    const banner = getBanners()[0];
    expect(banner).toMatchObject({
      level: "success",
      text: envConfig.vaxBannerMessages[0],
    });
    expect(banner?.important).not.toBe(true);
    removeBanner(banner?.id ?? -1);
    expect(getBanners()).toHaveLength(0);
  });

  it.each([0.1, 0.999])("shows nothing when the roll is %s", (roll) => {
    vi.spyOn(Math, "random").mockReturnValue(roll);
    show();
    expect(getBanners()).toHaveLength(0);
  });

  it.each([0, 1, 2, 3, 4])("can choose approved sentence %s", (index) => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce((index + 0.5) / 5);
    show();
    expect(getBanners()[0]?.text).toBe(envConfig.vaxBannerMessages[index]);
  });

  it("uses custom environment messages and allows disabling the banner", () => {
    const originalMessages = envConfig.vaxBannerMessages;
    try {
      envConfig.vaxBannerMessages = ["custom vax message"];
      vi.spyOn(Math, "random").mockReturnValue(0);
      show();
      expect(getBanners()[0]?.text).toBe("custom vax message");
      for (const banner of [...getBanners()]) removeBanner(banner.id);
      envConfig.vaxBannerMessages = [];
      show();
      expect(getBanners()).toHaveLength(0);
    } finally {
      envConfig.vaxBannerMessages = originalMessages;
    }
  });
});
