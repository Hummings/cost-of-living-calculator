import Answer from './Answer';
import Immutable from 'immutable';

const Question = Immutable.Record({
  title: "",
  answers: new Immutable.List(),
  subQuestions: new Immutable.List(),
});

Object.assign(Question.prototype, {

});

Question.deserialize = json => {
  json = Object.assign({}, json);
  const hasAnswersSpecified = json.answers && json.answers.length;
  const hasSubQuestionsSpecified = json.subQuestions && json.subQuestions.length;

  if (hasAnswersSpecified && hasSubQuestionsSpecified) {
    throw new Error('Either answers or subQuestions is required but not both');
  }


  if (hasAnswersSpecified) {
    json.answers = new Immutable.List(
      json.answers.map(a => Answer.deserialize(a))
    );
  }
  if (hasSubQuestionsSpecified) {
    json.subQuestions = new Immutable.List(
      json.subQuestions.map(c => Question.deserialize(c))
    );
  }
  return new Question(json);
}

export default Question;
