import Immutable from 'immutable';
import utils from '../utils';

let id = 0;

class ScoreCalculation {
  constructor(quiz, _props) {
    if (!quiz) {
      throw new Error('quiz is required');
    }
    this.quiz = quiz;
    this.id = (++id);
    Object.assign(this, {
      selectedAnswers: Immutable.Map(),
      answerCallback: utils.NO_OP,
      questionCompletedCallbacks: Immutable.Map(),
    }, _props);
  }

  onAnswer(callback) {
    return new ScoreCalculation(this.quiz, {
      selectedAnswers: this.selectedAnswers,
      answerCallback: utils.combine(this.answerCallback, callback),
      questionCompletedCallbacks: this.questionCompletedCallbacks,
    });
  }

  onQuestionCompleted(question, callback) {
    return new ScoreCalculation(this.quiz, {
      selectedAnswers: this.selectedAnswers,
      answerCallback: this.answerCallback,
      questionCompletedCallbacks: this.questionCompletedCallbacks.set(
        question, utils.combine(
          callback,
          this.questionCompletedCallbacks.get(question, utils.NO_OP)
        )
      ),
    });
  }

  recordAnswer(question, answer) {
    const newCalculation = new ScoreCalculation(this.quiz, {
      selectedAnswers: this.selectedAnswers.set(question, answer),
      answerCallback: this.answerCallback,
      questionCompletedCallbacks: this.questionCompletedCallbacks,
    });

    this.answerCallback(newCalculation);

    this.questionCompletedCallbacks.keySeq().forEach(q => {
      if(q.isCompleted(newCalculation.selectedAnswers) && !q.isCompleted(this.selectedAnswers)) {
        this.questionCompletedCallbacks.get(q)();
      }
    });
    return newCalculation;
  }

  computeScore() {
    return this.quiz.questions
      .map(q => q.computeScore(this.selectedAnswers))
      .reduce((a, b) => a + b, 0);

  }

}


export default ScoreCalculation;
