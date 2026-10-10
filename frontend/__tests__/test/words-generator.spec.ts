import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Config } from "../../src/ts/config/store";
import { getDefaultConfig } from "../../src/ts/constants/default-config";
import { setIsRepeated } from "../../src/ts/states/test";
import { generateWords } from "../../src/ts/test/words-generator";

const language = {
  name: "english" as const,
  words: ["alpha", "bravo", "charlie", "delta"],
};

describe("vax in generated tests", () => {
  beforeEach(() => {
    Object.assign(Config, getDefaultConfig(), {
      language: "english",
      mode: "words",
      words: 6,
      funbox: [],
    });
    setIsRepeated(false);
  });

  afterEach(() => {
    setIsRepeated(false);
    vi.restoreAllMocks();
  });

  it("inserts vax with normal separators and avoids nearby repeats", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const generated = await generateWords(language);
    expect(generated.words[0]).toBe("vax ");
    expect(generated.words[1]).not.toBe("vax ");
    expect(generated.words[2]).not.toBe("vax ");
    expect(generated.words[3]).toBe("vax ");
    expect(generated.words).toHaveLength(6);
    expect(generated.words.join("")).not.toContain("vax is the goat");
    expect(language.words).not.toContain("vax");
  });

  it("preserves the exact generated words when repeating a test", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    const generated = await generateWords(language);
    setIsRepeated(true);
    random.mockReturnValue(0.999);
    const repeated = await generateWords(language);
    expect(repeated.words).toEqual(generated.words);
  });

  it("applies normal punctuation to the injected word", async () => {
    Config.punctuation = true;
    vi.spyOn(Math, "random").mockReturnValue(0);
    const generated = await generateWords(language);
    expect(generated.words[0]).toBe("Vax ");
  });
});
