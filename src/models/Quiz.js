import Immutable from 'immutable';
import Question from './Question';

const Quiz = Immutable.Record({
  version: 'v1',
  questions: new Immutable.List(),
});

Quiz.deserialize = json => {
  json = Object.assign({ questions: [] }, json);
  json.questions = new Immutable.List(
    json.questions.map(Question.deserialize)
  );
  return new Quiz(json);
};

export default Quiz;
