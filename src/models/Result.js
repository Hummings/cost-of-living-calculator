import Immutable from 'immutable';
import ScoreRange from './ScoreRange';


const Result = Immutable.Record({
  scoreRange: new ScoreRange(),
  requiredIncome: 0,
});

Result.deserialize = json => {
  json = Object.assign({}, json);
  return new Result({
    scoreRange: ScoreRange.deserialize(json.scoreRange),
    requiredIncome: json.requiredIncome,
  });
};

export default Result;
