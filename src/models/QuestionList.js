import Immutable from 'immutable';
import Question from './Question';

const QuestionList = Immutable.Record({
  version: 'v1',
  questions: new Immutable.List(),
});

QuestionList.deserialize = json => {
  json = Object.assign({ questions: [] }, json);
  json.questions = new Immutable.List(
    json.questions.map(Question.deserialize)
  );
  return new QuestionList(json);
};

export default QuestionList;
