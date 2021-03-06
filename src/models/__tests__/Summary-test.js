import Immutable from 'immutable';
import Result from '../Result';
import ScoreRange from '../ScoreRange';
import Summary from '../Summary';


describe('Summary', () => {
  describe('deserialize', () => {
    it('deserializes the results', () => {
      const summary = Summary.deserialize({
        results: [
          {
            scoreRange: {
              minScore: 1,
              maxScore: 100,
            },
            requiredIncome: 100000,
          },
          {
            scoreRange: {
              minScore: 101,
              maxScore: 500,
            },
            requiredIncome: 550000,
          },
        ],
      });
      expect(summary).toEqual(new Summary({
        results: Immutable.List.of(
          new Result({
            scoreRange: new ScoreRange({
              minScore: 1,
              maxScore: 100,
            }),
            requiredIncome: 100000,
          }),
          new Result({
            scoreRange: new ScoreRange({
              minScore: 101,
              maxScore: 500,
            }),
            requiredIncome: 550000,
          }),
        ),
      }));
    });
  });

  describe('getResultForScore', () => {
    it('returns the matching result for the given score', () => {
      const r1 = new Result({
        scoreRange: new ScoreRange({
          minScore: 0,
          maxScore: 100,
        }),
        requiredIncome: 100000,
      });
      const r2 = new Result({
        scoreRange: new ScoreRange({
          minScore: 101,
          maxScore: 500,
        }),
        requiredIncome: 550000,
      });
      const summary = new Summary({ results: Immutable.List.of(r1, r2) });
      expect(summary.getResultForScore(50)).toBe(r1);
      expect(summary.getResultForScore(250)).toBe(r2);
    });
  });
});
