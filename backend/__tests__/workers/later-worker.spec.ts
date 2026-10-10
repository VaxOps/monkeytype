import { describe, it, expect, vi } from "vitest";
import * as LaterWorker from "../../src/workers/later-worker";
import { getCachedConfiguration } from "../../src/init/configuration";
import { WeeklyXpLeaderboard } from "../../src/services/weekly-xp-leaderboard";
const calculateXpReward = LaterWorker.__testing.calculateXpReward;

describe("later-worker", () => {
  it("skips weekly rewards when a leaderboard has no reward brackets", async () => {
    const configuration = await getCachedConfiguration(false);
    const original = configuration.leaderboards.weeklyXp;
    const getResults = vi.spyOn(WeeklyXpLeaderboard.prototype, "getResults");
    try {
      configuration.leaderboards.weeklyXp = {
        ...original,
        enabled: true,
        xpRewardBrackets: [],
      };
      await LaterWorker.__testing.handleWeeklyXpLeaderboardResults({
        lastWeekTimestamp: 0,
      });
      expect(getResults).not.toHaveBeenCalled();
    } finally {
      configuration.leaderboards.weeklyXp = original;
      getResults.mockRestore();
    }
  });

  describe("calculateXpReward", () => {
    it("should return the correct XP reward for a given rank", () => {
      //GIVEN
      const xpRewardBrackets = [
        { minRank: 1, maxRank: 1, minReward: 100, maxReward: 100 },
        { minRank: 2, maxRank: 10, minReward: 50, maxReward: 90 },
      ];

      //WHEN / THEN
      expect(calculateXpReward(xpRewardBrackets, 5)).toBe(75);
      expect(calculateXpReward(xpRewardBrackets, 11)).toBeUndefined();
    });

    it("should return the highest XP reward if brackets overlap", () => {
      //GIVEN
      const xpRewardBrackets = [
        { minRank: 1, maxRank: 5, minReward: 900, maxReward: 1000 },
        { minRank: 2, maxRank: 20, minReward: 50, maxReward: 90 },
      ];

      //WHEN
      const reward = calculateXpReward(xpRewardBrackets, 5);

      //THEN
      expect(reward).toBe(900);
    });
  });
});
