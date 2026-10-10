import { afterEach, describe, expect, it, vi } from "vitest";

import { getBanners, removeBanner } from "../../src/ts/states/banners";
import { show } from "../../src/ts/elements/vax-banner";

describe("vax top banner", () => {
  afterEach(() => {
    for (const banner of [...getBanners()]) removeBanner(banner.id);
    vi.restoreAllMocks();
  });

  it("shows the dismissible accent strip below the five percent boundary", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.049999);
    show();
    expect(getBanners()).toHaveLength(1);
    const banner = getBanners()[0];
    expect(banner).toMatchObject({ level: "success", text: "vax is the goat" });
    expect(banner?.important).not.toBe(true);
    removeBanner(banner?.id ?? -1);
    expect(getBanners()).toHaveLength(0);
  });

  it.each([0.05, 0.999])("shows nothing when the roll is %s", (roll) => {
    vi.spyOn(Math, "random").mockReturnValue(roll);
    show();
    expect(getBanners()).toHaveLength(0);
  });
});
