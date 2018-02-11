import Answer from './Answer';
import Immutable from 'immutable';

import { dasherize } from '../utils';

const SubQuestionModes = {
  ANSWER_ALL: Symbol(),
  ANSWER_ONE: Symbol(),
};

const Question = Immutable.Record({
  id: '',
  title: '',
  answers: new Immutable.List(),
  subQuestions: new Immutable.List(),
  subQuestionMode: SubQuestionModes.ANSWER_ALL,
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

  isCompleted(selectedAnswers) {
    selectedAnswers = selectedAnswers || Immutable.Map();
    if (this.hasSubQuestions() && this.subQuestionMode === SubQuestionModes.ANSWER_ALL) {
      return this.subQuestions.every(q => q.isCompleted(selectedAnswers));
    } else if (this.hasSubQuestions() && this.subQuestionMode === SubQuestionModes.ANSWER_ONE) {
      return this.subQuestions.some(q => q.isCompleted(selectedAnswers));
    } else {
      return selectedAnswers.has(this);
    }
  },

  computeScore(selectedAnswers) {
    selectedAnswers = selectedAnswers || Immutable.Map();
    if (!this.isCompleted(selectedAnswers)) {
      return 0;
    }

    if (this.hasSubQuestions()) {
      return this.subQuestions
        .map(q => q.computeScore(selectedAnswers))
        .reduce((a, b) => a + b, 0);
    } else {
      const answer = selectedAnswers.get(this);
      return answer ? answer.points : 0;
    }
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

  if (json.subQuestionMode) {
    if (!SubQuestionModes[json.subQuestionMode]) {
      throw new Error('invalid subquestion mode ' + json.subQuestionMode);
    }
    json.subQuestionMode = SubQuestionModes[json.subQuestionMode];
  }

  return new Question(json);
}

Question.SubQuestionModes = SubQuestionModes;

export default Question;
