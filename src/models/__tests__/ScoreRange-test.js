import ScoreRange from '../ScoreRange';

describe('ScoreRange', () => {
  describe('deserialize', () => {
    it('deserializes the score range', () => {
      const sr = ScoreRange.deserialize({
        minScore: 234,
        maxScore: 923,
      });
      expect(sr).toEqual(new ScoreRange({
        minScore: 234,
        maxScore: 923,
      }));
    });
  });

  describe('contains', () => {
    it('indicates if the range contains the score', () => {
      const sr = new ScoreRange({
        minScore: 5,
        maxScore: 12,
      });

      expect(sr.contains(4)).toBe(false);
      expect(sr.contains(5)).toBe(true);
      expect(sr.contains(7)).toBe(true);
      expect(sr.contains(12)).toBe(true);
      expect(sr.contains(13)).toBe(false);
    });
  });
});
