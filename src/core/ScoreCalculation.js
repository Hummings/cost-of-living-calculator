import Immutable from 'immutable';
import utils from '../utils';
import SubQuestionModes from '../models/SubQuestionModes';

import { Map } from 'immutable';
import SelectedAnswers from './SelectedAnswers';

let id = 0;

class ScoreCalculation {
  constructor(quiz, _props) {
    if (!quiz) {
      throw new Error('quiz is required');
    }
    this.quiz = quiz;
    this.id = (++id);
    Object.assign(this, {
      selectedAnswers: new SelectedAnswers(),
      changeCallback: utils.NO_OP,
      questionCompletedCallbacks: Map(),
    }, _props);
  }

  onChange(callback) {
    return this._copyWith({
      changeCallback: utils.combine(this.changeCallback, callback),
    });
  }

  onQuestionCompleted(question, callback) {
    return this._copyWith({
      questionCompletedCallbacks: this.questionCompletedCallbacks.set(
        question, utils.combine(
          callback,
          this.questionCompletedCallbacks.get(question, utils.NO_OP)
        )
      ),
    });
  }

  recordAnswer(question, answer) {
    const newSelectedAnswers = this.selectedAnswers.recordAnswer(question, answer);
    const newCalculation = this._copyWith({
      selectedAnswers: newSelectedAnswers,
    });

    this.changeCallback(newCalculation);

    this.questionCompletedCallbacks.keySeq().forEach(q => {
      if (newSelectedAnswers.isCompleted(q) && !this.selectedAnswers.isCompleted(q)) {
        this.questionCompletedCallbacks.get(q)();
      }
    });

    return newCalculation;
  }

  deleteAnswer(question, answer) {
    const newCalculation = this._copyWith({
      selectedAnswers: this.selectedAnswers.deleteAnswer(question, answer),
    });
    this.changeCallback(newCalculation);
    return newCalculation;
  }

  hasAnswer(question) {
    return this.selectedAnswers.hasAnswer(question);
  }

  completeMultipleChoiceQuestion(question) {
    const newCalculation = this._copyWith({
      selectedAnswers: this.selectedAnswers.recordCompletedQuestion(question),
    });
    this.changeCallback(newCalculation);
    this.questionCompletedCallbacks.get(question, utils.NO_OP)();
    return newCalculation;
  }

  computeScore() {
    return this.quiz.questions
      .map(q => this.selectedAnswers.computeQuestionScore(q))
      .reduce((a, b) => a + b, 0);
  }

  isSelected(question, answer) {
    return this.selectedAnswers.isSelected(question, answer);
  }

  clearCallbacks() {
    return this._copyWith({
      changeCallback: utils.NO_OP,
      questionCompletedCallbacks: Map(),
    });
  }

  _copyWith(partial) {
    return new ScoreCalculation(this.quiz, Object.assign({
      selectedAnswers: this.selectedAnswers,
      changeCallback: this.changeCallback,
      questionCompletedCallbacks: this.questionCompletedCallbacks,
    }, partial));
  }
}


export default ScoreCalculation;
