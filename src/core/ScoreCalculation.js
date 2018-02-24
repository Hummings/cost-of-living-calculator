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
      answerCallback: utils.NO_OP,
      questionCompletedCallbacks: Map(),
    }, _props);
  }

  onAnswer(callback) {
    return new ScoreCalculation(this.quiz, Object.assign({}, this, {
      answerCallback: utils.combine(this.answerCallback, callback),
    }));
  }

  onQuestionCompleted(question, callback) {
    return new ScoreCalculation(this.quiz, Object.assign({}, this, {
      questionCompletedCallbacks: this.questionCompletedCallbacks.set(
        question, utils.combine(
          callback,
          this.questionCompletedCallbacks.get(question, utils.NO_OP)
        )
      ),
    }));
  }

  recordAnswer(question, answer) {
    const newEntrySet = this.entrySet.recordAnswer(question, answer);
    const newCalculation = new ScoreCalculation(this.quiz, Object.assign({}, this, {
      entrySet: newEntrySet,
    }));

    this.answerCallback(newCalculation);

    this.questionCompletedCallbacks.keySeq().forEach(q => {
      if (newEntrySet.isCompleted(q) && !this.entrySet.isCompleted(q)) {
        this.questionCompletedCallbacks.get(q)();
      }
    });

    return newCalculation;
  }

  deleteAnswer(question, answer) {
    return new ScoreCalculation(this.quiz, Object.assign({}, this, {
      entrySet: this.entrySet.deleteAnswer(question, answer),
    }));
  }

  completeMultipleChoiceQuestion(question) {
    this.questionCompletedCallbacks.get(question, utils.NO_OP)();
    return new ScoreCalculation(this.quiz, Object.assign({}, this, {
      entrySet: this.entrySet.recordCompletedQuestion(question),
    }));
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
    return new ScoreCalculation(this.quiz, {
      entrySet: this.entrySet,
    });
  }
}


export default ScoreCalculation;
