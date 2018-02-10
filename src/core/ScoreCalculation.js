import Immutable from 'immutable';
import utils from '../utils';


class ScoreCalculation {
  constructor(quiz, _props) {
    if (!quiz) {
      throw new Error('quiz is required');
    }
    this.quiz = quiz;
    Object.assign(this, {
      selectedAnswers: Immutable.Map(),
      completedQuestions: Immutable.List(),
      answerCallback: utils.NO_OP,
      questionCompletedCallback: utils.NO_OP,
    }, _props);
  }

  onAnswer(callback) {
    return new ScoreCalculation(
      this.quiz,
      {
        selectedAnswers: this.selectedAnswers,
        completedQuestions: this.completedQuestions,
        answerCallback: utils.combine(this.answerCallback, callback),
        questionCompletedCallback: this.questionCompletedCallback,
      }
    );
  }

  onQuestionCompleted(callback) {
    return new ScoreCalculation(
      this.quiz,
      {
        selectedAnswers: this.selectedAnswers,
        completedQuestions: this.completedQuestions,
        answerCallback: this.answerCallback,
        questionCompletedCallback: utils.combine(this.questionCompletedCallback, callback),
      }
    );
  }

  recordAnswer(question, answer) {
    const newSelectedAnswers = this.selectedAnswers.set(question, answer);
    const newCompletedQuestions = this.quiz.questions.filter(q => q.isCompleted(newSelectedAnswers));
    const newCalculation = new ScoreCalculation(
      this.quiz,
      {
        selectedAnswers: newSelectedAnswers,
        completedQuestions: newCompletedQuestions,
        answerCallback: this.answerCallback,
        questionCompletedCallback: this.questionCompletedCallback,
      }
    );

    this.answerCallback(newCalculation);

    if (newCalculation.completedQuestions.size > this.completedQuestions.size) {
      this.questionCompletedCallback();
    }
    return newCalculation;
  }

  computeScore() {
    return this.quiz.questions
      .map(q => q.computeScore(this.selectedAnswers))
      .reduce((a, b) => a + b, 0);

  }
}

export default ScoreCalculation;
