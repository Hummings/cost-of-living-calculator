import Immutable from 'immutable';


const ScoreRange = Immutable.Record({
  minScore: 0,
  maxScore: 1,
});

ScoreRange.deserialize = json => {
  return new ScoreRange(Object.assign({}, json));
};

export default ScoreRange;
