import Immutable from 'immutable';


const ScoreRange = Immutable.Record({
  minScore: 0,
  maxScore: 1,
});

Object.assign(ScoreRange.prototype, {
  contains(score) {
    return (this.minScore <= score) && (score <= this.maxScore);

  }
});

ScoreRange.deserialize = json => {
  return new ScoreRange(Object.assign({}, json));
};

export default ScoreRange;
