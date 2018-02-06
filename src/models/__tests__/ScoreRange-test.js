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
});
