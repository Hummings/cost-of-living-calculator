import Immutable from 'immutable';
import utils from '../utils';


class ScoreCalculation {
  constructor(quiz, _selectedAnswers, _completedQuestions) {
    if (!quiz) {
      throw new Error('quiz is required');
    }
    this.quiz = quiz;
    this.selectedAnswers = _selectedAnswers || Immutable.Map();
    this.completedQuestions = _completedQuestions || Immutable.List();
  }

  onAnswer(callback) {
    return new CalcualationWithCallback(
      this,
      { answerCallback: callback }
    );
  }

  onQuestionCompleted(callback) {
    return new CalcualationWithCallback(
      this,
      { questionCompletedCallback: callback }
    );
  }

  recordAnswer(question, answer) {
    const newSelectedAnswers = this.selectedAnswers.set(question, answer);
    const newCompletedQuestions = this.quiz.questions.filter(q => q.isCompleted(newSelectedAnswers));

    return new ScoreCalculation(this.quiz, newSelectedAnswers, newCompletedQuestions);
  }

  computeScore() {
    return this.quiz.questions
      .map(q => q.computeScore(this.selectedAnswers))
      .reduce((a, b) => a + b, 0);

  }
}

class CalcualationWithCallback {
  constructor(calculation, callbacks) {
    this.calculation = calculation;
    Object.assign(this, {
      answerCallback: () => {},
      questionCompletedCallback: () => {},
    }, callbacks);
  }

  onAnswer(callback) {
    return new CalcualationWithCallback(
      this.calculation,
      {
        answerCallback: utils.combine(this.answerCallback, callback),
        questionCompletedCallback: this.questionCompletedCallback,
      },
    );
  }

  onQuestionCompleted(callback) {
    return new CalcualationWithCallback(
      this.calculation,
      {
        answerCallback: this.answerCallback,
        questionCompletedCallback: utils.combine(this.questionCompletedCallback, callback),
      },
    );
  }

  recordAnswer(question, answer) {
    const newCalculation = this.calculation.recordAnswer(question, answer);
    this.answerCallback(newCalculation);

    if (newCalculation.completedQuestions.size > this.calculation.completedQuestions.size) {
      this.questionCompletedCallback();
    }
    return new CalcualationWithCallback(newCalculation, {
      answerCallback: this.answerCallback,
      questionCompletedCallback: this.questionCompletedCallback,
    });
  }
}

export default ScoreCalculation;
