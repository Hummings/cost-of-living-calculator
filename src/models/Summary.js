import Immutable from 'immutable';
import Result from './Result';


const Summary = Immutable.Record({
  results: new Immutable.List(),
});

Object.assign(Summary.prototype, {
  getResultForScore(score) {
    return this.results.find(r => r.scoreRange.contains(score));
  }
});


Summary.deserialize = json => {
  return new Summary({
    results: new Immutable.List(
      (json.results || []).map(r => Result.deserialize(r))
    ),
  });
};

export default Summary;
