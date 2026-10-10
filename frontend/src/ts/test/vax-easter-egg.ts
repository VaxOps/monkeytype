import { Config } from "../config/store";
import { getLoadedChallenge } from "../states/test";

export function applyVaxEasterEgg(
  word: string,
  previousWord: string | undefined,
  previousWord2: string | undefined,
): string {
  if (
    Config.language !== "english" ||
    (Config.mode !== "time" && Config.mode !== "words") ||
    (Config.funbox?.length ?? 0) > 0 ||
    getLoadedChallenge() !== null ||
    previousWord === "vax" ||
    previousWord2 === "vax"
  ) {
    return word;
  }

  // About one in 500 words; keep quotes, custom text and challenges intact.
  return Math.random() < 0.002 ? "vax" : word;
}
