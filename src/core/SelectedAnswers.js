import SubQuestionModes from '../models/SubQuestionModes';
import Quiz from '../models/Quiz';
import { Record, Map, Set } from 'immutable';


class SelectedAnswers extends Record({ entries: Map(), completedQuestions: Set() }) {

  recordAnswer(question, answer) {
    return new SelectedAnswers({
      completedQuestions: this.completedQuestions,
      entries: this.entries.set(
        question, this._getAnswers(question).add(answer),
      ),
    });
  }

  deleteAnswer(question, answer) {
    return new SelectedAnswers({
      completedQuestions: this.completedQuestions,
      entries: this.entries.set(
        question, this._getAnswers(question).filter(a => a !== answer)
      ),
    });
  }

  recordCompletedQuestion(question) {
    return new SelectedAnswers({
      completedQuestions: this.completedQuestions.add(question),
      entries: this.entries,
    });
  }

  isSelected(question, answer) {
    return this._getAnswers(question).contains(answer);
  }

  hasAnswer(question) {
    return !!this._getAnswers(question).size;
  }

  isCompleted(question) {
    if (question.isMultipleChoice) {
      return this.completedQuestions.has(question);
    } else {
      return this._isAnswered(question);
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
      return this._getAnswers(question)
        .map(a => this._computeAnswerScore(a))
        .reduce((a, b) => a+ b, 0);
    }
  }

  _isAnswered(question) {
    if (question.hasSubQuestions()) {
      return this._areAllSubQuestionsAnswered(question.subQuestions, question.subQuestionMode);
    } else {
      const selectedAnswers = this._getAnswers(question);
      return !!selectedAnswers.size && selectedAnswers
        .map(a => this._isAnswerCompleted(a))
        .reduce((a, b) => a && b, true);
    }
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
        return subQuestions.every(q => this._isAnswered(q));
      case SubQuestionModes.ANSWER_ONE:
        return subQuestions.some(q => this._isAnswered(q));
      default:
        throw new Error('unknown subquestion mode ' + subQuestionMode);
    }
  }

  _computeAnswerScore(answer) {
    if (answer.hasSubQuestions()) {
      const multiplier = answer.getMultiplyingSubQuestion() ?
                         this.computeQuestionScore(answer.getMultiplyingSubQuestion()) :
                         1;
      return answer.subQuestions
        .filter(q => q !== answer.getMultiplyingSubQuestion())
        .map(q => multiplier * this.computeQuestionScore(q))
        .reduce((a, b) => a + b, 0);
    } else {
      return answer.points;
    }
  }

  _getAnswers(question) {
    return this.entries.get(question, Set());
  }
}

export default SelectedAnswers;
