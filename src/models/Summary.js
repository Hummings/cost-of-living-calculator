import Immutable from 'immutable';
import Result from './Result';


const Summary = Immutable.Record({
  results: new Immutable.List(),
});


Summary.deserialize = json => {
  return new Summary({
    results: new Immutable.List(
      (json.results || []).map(r => Result.deserialize(r))
    ),
  });
};

export default Summary;
