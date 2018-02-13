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

  isCompleted(selectedAnswers) {
    selectedAnswers = selectedAnswers || Immutable.Map();

    if (this.hasSubQuestions()) {
      return this._areAllSubQuestionsAnswered(this.subQuestions, this.subQuestionMode, selectedAnswers);
    } else {
      const answer = selectedAnswers.get(this);
      if (answer && answer.hasSubQuestions()) {
        return this._areAllSubQuestionsAnswered(answer.subQuestions, answer.subQuestionMode, selectedAnswers);
      } else {
        return !!answer;
      }
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

  _areAllSubQuestionsAnswered(subQuestions, subQuestionMode, selectedAnswers) {
    switch(subQuestionMode) {
      case SubQuestionModes.ANSWER_ALL:
        return subQuestions.every(q => q.isCompleted(selectedAnswers));
      case SubQuestionModes.ANSWER_ONE:
        return subQuestions.some(q => q.isCompleted(selectedAnswers));
      default:
        throw new Error('unknown subquestion mode ' + this.subQuestionMode);
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

  json.subQuestionMode = SubQuestionModes.deserialize(json.subQuestionMode);
  return new Question(json);
}

export default Question;
