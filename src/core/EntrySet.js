import SubQuestionModes from '../models/SubQuestionModes';
import Quiz from '../models/Quiz';
import { Record, List, Map, Set } from 'immutable';

class SelectedAnswers extends Record({entries: Map()}) {

  recordAnswer(question, answer) {
    return new SelectedAnswers({
      entries: this.entries.set(
        question, this.entries.get(question, List()).push(answer),
      )
    });
  }

  isAnswered(question) {
    if (question.hasSubQuestions()) {
      return this._areAllSubQuestionsAnswered(question.subQuestions, question.subQuestionMode);
    } else {
      const selectedAnswers = this.entries.get(question, List());
      return !!selectedAnswers.size && selectedAnswers
        .map(a => this._isAnswerCompleted(a))
        .reduce((a, b) => a && b, true);
    }
  }

  computeQuestionScore(question) {
    const answers = this.entries.get(question, List());
    return answers
      .map(a => this._computeAnswerScore(a))
      .reduce((a, b) => a+ b, 0);
  }

  _isAnswerCompleted(answer) {
    if (answer.hasSubQuestions()) {
      return this._areAllSubQuestionsAnswered(answer.subQuestions, answer.subQuestionMode);
    } else {
      return true;
    }
  }

  _areAllSubQuestionsAnswered(subQuestions, subQuestionMode) {
    switch(subQuestionMode) {
      case SubQuestionModes.ANSWER_ALL:
        return subQuestions.every(q => this.isAnswered(q));
      case SubQuestionModes.ANSWER_ONE:
        return subQuestions.some(q => this.isAnswered(q));
      default:
        throw new Error('unknown subquestion mode ' + subQuestionMode);
    }
  }

  _computeAnswerScore(answer) {
    if (answer.hasSubQuestions()) {
      return answer.subQuestions
        .map(q => this.computeQuestionScore(q))
        .reduce((a, b) => a + b, 0);
    } else {
      return answer.points;
    }
  }
}

class EntrySet extends Record({ selectedAnswers: new SelectedAnswers(), completedQuestions: Set() }) {

  recordAnswer(question, answer) {
    return new EntrySet({
      completedQuestions: this.completedQuestions,
      selectedAnswers: this.selectedAnswers.recordAnswer(question, answer),
    });
  }

  recordCompletedQuestion(question) {
    return new EntrySet({
      completedQuestions: this.completedQuestions.add(question),
      selectedAnswers: this.selectedAnswers,
    });
  }

  isCompleted(question) {
    if (question.isMultipleChoice) {
      return this.completedQuestions.has(question);
    } else {
      return this.selectedAnswers.isAnswered(question);
    }
  }

  computeQuestionScore(question) {
    if (!this.isCompleted(question)) {
      return 0;
    }

    if (question.hasSubQuestions()) {
      return question.subQuestions
        .map(q => this.computeQuestionScore(q))
        .reduce((a, b) => a + b, 0);
    } else {
      return this.selectedAnswers.computeQuestionScore(question);
    }
  }
}

export default EntrySet;