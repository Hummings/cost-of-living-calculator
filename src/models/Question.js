import Answer from './Answer';
import Immutable from 'immutable';
import SubQuestionModes from './SubQuestionModes';

import { dasherize } from '../utils';

const Question = Immutable.Record({
  id: '',
  title: '',
  answers: new Immutable.List(),
  subQuestions: new Immutable.List(),
  subQuestionMode: SubQuestionModes.ANSWER_ALL,
  isMultipleChoice: false,
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

  hasAnswers() {
    return !!this.answers.size;
  },

});

Question.deserialize = json => {
  json = Object.assign({}, json);
  const hasAnswersSpecified = json.answers && json.answers.length;
  const hasSubQuestionsSpecified = json.subQuestions && json.subQuestions.length;

  if ((hasAnswersSpecified && hasSubQuestionsSpecified) ||
     (!hasAnswersSpecified && !hasSubQuestionsSpecified)) {
    throw new Error(
      'Either answers or subQuestions is required but not both: ' + JSON.stringify(json));
  }

  json.answers = new Immutable.List(
    (json.answers || []).map(a => Answer.deserialize(a))
  );
  json.subQuestions = new Immutable.List(
    (json.subQuestions || []).map(c => Question.deserialize(c))
  );

  json.subQuestionMode = SubQuestionModes.deserialize(json.subQuestionMode);
  return new Question(json);
}

export default Question;
