import Answer from './Answer';
import Immutable from 'immutable';

import { dasherize } from '../utils';

const Question = Immutable.Record({
  id: '',
  title: '',
  answers: new Immutable.List(),
  subQuestions: new Immutable.List(),
});

Object.assign(Question.prototype, {
  getId() {
    if (this.id) {
      return this.id;
    } else {
      return dasherize(this.title);
    }
  },

  hasSubQuestions() {
    return !!this.subQuestions.size;
  },
});

Question.deserialize = json => {
  json = Object.assign({}, json);
  const hasAnswersSpecified = json.answers && json.answers.length;
  const hasSubQuestionsSpecified = json.subQuestions && json.subQuestions.length;

  if ((hasAnswersSpecified && hasSubQuestionsSpecified) ||
     (!hasAnswersSpecified && !hasSubQuestionsSpecified)) {
    throw new Error('Either answers or subQuestions is required but not both');
  }

  json.answers = new Immutable.List(
    (json.answers || []).map(a => Answer.deserialize(a))
  );
  json.subQuestions = new Immutable.List(
    (json.subQuestions || []).map(c => Question.deserialize(c))
  );

  return new Question(json);
}

export default Question;
