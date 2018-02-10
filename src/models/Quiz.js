import Immutable from 'immutable';
import Question from './Question';
import Summary from './Summary';

const Quiz = Immutable.Record({
  version: 'v1',
  questions: new Immutable.List(),
  summary: new Summary(),
});

Quiz.deserialize = json => {
  return new Quiz({
    version: json.version || 'v1',
    questions: new Immutable.List((json.questions ||[]).map(Question.deserialize)),
    summary: Summary.deserialize(json.summary || {}),
  });
};

export default Quiz;
