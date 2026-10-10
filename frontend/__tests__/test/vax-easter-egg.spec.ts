import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Config } from "../../src/ts/config/store";
import { getDefaultConfig } from "../../src/ts/constants/default-config";
import { applyVaxEasterEgg } from "../../src/ts/test/vax-easter-egg";

const { getLoadedChallenge } = vi.hoisted(() => ({
  getLoadedChallenge: vi.fn((): unknown => null),
}));

vi.mock("../../src/ts/states/test", () => ({ getLoadedChallenge }));

describe("vax word easter egg", () => {
  beforeEach(() => {
    Object.assign(Config, getDefaultConfig(), {
      language: "english",
      mode: "time",
      funbox: [],
    });
    getLoadedChallenge.mockReturnValue(null);
  });

  afterEach(() => vi.restoreAllMocks());

  it.each(["time", "words"] as const)(
    "occasionally inserts only vax in English %s mode",
    (mode) => {
      Config.mode = mode;
      vi.spyOn(Math, "random").mockReturnValue(0.001999);
      expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("vax");
    },
  );

  it("keeps normal words at and above the probability boundary", () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0.002);
    expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("hello");
    random.mockReturnValue(0.999);
    expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("hello");
  });

  it.each(["quote", "custom", "zen"] as const)(
    "leaves %s mode intact without rolling",
    (mode) => {
      Config.mode = mode;
      const random = vi.spyOn(Math, "random").mockReturnValue(0);
      expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("hello");
      expect(random).not.toHaveBeenCalled();
    },
  );

  it.each(["english_1k", "english_5k", "spanish"] as const)(
    "leaves %s vocabulary intact",
    (language) => {
      Config.language = language;
      vi.spyOn(Math, "random").mockReturnValue(0);
      expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("hello");
    },
  );

  it("leaves funboxes and challenges intact", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    Config.funbox = ["zipf"];
    expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("hello");
    Config.funbox = [];
    getLoadedChallenge.mockReturnValue({});
    expect(applyVaxEasterEgg("hello", undefined, undefined)).toBe("hello");
  });

  it.each([
    ["vax", "the"],
    ["the", "vax"],
  ])("avoids nearby repeats after %s and %s", (previous, previous2) => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(applyVaxEasterEgg("hello", previous, previous2)).toBe("hello");
  });
});
