import Immutable from 'immutable';
import utils from '../utils';
import SubQuestionModes from '../models/SubQuestionModes';

import { Map } from 'immutable';
import EntrySet from './EntrySet';

let id = 0;

class ScoreCalculation {
  constructor(quiz, _props) {
    if (!quiz) {
      throw new Error('quiz is required');
    }
    this.quiz = quiz;
    this.id = (++id);
    Object.assign(this, {
      entrySet: new EntrySet(),
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
    const newEntrySet = this.entrySet.recordAnswer(question, answer);
    const newCalculation = this._copyWith({
      entrySet: newEntrySet,
    });

    this.changeCallback(newCalculation);

    this.questionCompletedCallbacks.keySeq().forEach(q => {
      if (newEntrySet.isCompleted(q) && !this.entrySet.isCompleted(q)) {
        this.questionCompletedCallbacks.get(q)();
      }
    });

    return newCalculation;
  }

  deleteAnswer(question, answer) {
    const newCalculation = this._copyWith({
      entrySet: this.entrySet.deleteAnswer(question, answer),
    });
    this.changeCallback(newCalculation);
    return newCalculation;
  }

  hasAnswer(question) {
    return this.entrySet.hasAnswer(question);
  }

  completeMultipleChoiceQuestion(question) {
    const newCalculation = this._copyWith({
      entrySet: this.entrySet.recordCompletedQuestion(question),
    });
    this.changeCallback(newCalculation);
    this.questionCompletedCallbacks.get(question, utils.NO_OP)();
    return newCalculation;
  }

  computeScore() {
    return this.quiz.questions
      .map(q => this.entrySet.computeQuestionScore(q))
      .reduce((a, b) => a + b, 0);
  }

  isSelected(question, answer) {
    return this.entrySet.isSelected(question, answer);
  }

  clearCallbacks() {
    return this._copyWith({
      changeCallback: utils.NO_OP,
      questionCompletedCallbacks: Map(),
    });
  }

  _copyWith(partial) {
    return new ScoreCalculation(this.quiz, Object.assign({
      entrySet: this.entrySet,
      changeCallback: this.changeCallback,
      questionCompletedCallbacks: this.questionCompletedCallbacks,
    }, partial));
  }
}


export default ScoreCalculation;
