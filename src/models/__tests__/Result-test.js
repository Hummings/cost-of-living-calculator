import Immutable from 'immutable';
import Result from '../Result';
import ScoreRange from '../ScoreRange';


describe('Result', () => {
  describe('deserialize', () => {
    it('deserializes the result and score range', () => {
      const result = Result.deserialize({
        scoreRange: {
          minScore: 0,
          maxScore: 100,
        },
        requiredIncome: 5682,
      });
      expect(result).toEqual(new Result({
        scoreRange: new ScoreRange({
          minScore: 0,
          maxScore: 100,
        }),
        requiredIncome: 5682,
      }));
    });
  });
});
