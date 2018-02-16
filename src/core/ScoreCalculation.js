import Immutable from 'immutable';
import utils from '../utils';
import SubQuestionModes from '../models/SubQuestionModes';

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
      selectedAnswers: this.selectedAnswers.set(
        question, this.selectedAnswers.get(question, Immutable.List()).push(answer)
      ),
      answerCallback: this.answerCallback,
      questionCompletedCallbacks: this.questionCompletedCallbacks,
    });

    this.answerCallback(newCalculation);

    this.questionCompletedCallbacks.keySeq().forEach(q => {
      if(newCalculation._isCompleted(q) && !this._isCompleted(q)) {
        this.questionCompletedCallbacks.get(q)();
      }
    });
    return newCalculation;
  }

  computeScore() {
    return this.quiz.questions
      .map(q => this._computeQuestionScore(q))
      .reduce((a, b) => a + b, 0);

  }

  clearCallbacks() {
    return new ScoreCalculation(this.quiz, {
      selectedAnswers: this.selectedAnswers,
    });
  }

  _computeQuestionScore(question) {
    if (!this._isCompleted(question)) {
      return 0;
    }

    if (question.hasSubQuestions()) {
      return question.subQuestions
        .map(q => this._computeQuestionScore(q))
        .reduce((a, b) => a + b, 0);
    } else {
      const answers = this.selectedAnswers.get(
        question, Immutable.List()
      );
      return answers
        .map(a => this._computeAnswerScore(a))
        .reduce((a, b) => a+ b, 0);
    }
  }

  _computeAnswerScore(answer) {
    if (answer.hasSubQuestions()) {
      return answer.subQuestions
        .map(q => this._computeQuestionScore(q))
        .reduce((a, b) => a + b, 0);
    } else {
      return answer.points;
    }
  }

  _isCompleted(question) {
    if (question.hasSubQuestions()) {
      return this._areAllSubQuestionsAnswered(question.subQuestions, question.subQuestionMode);
    } else {
      const answers = this.selectedAnswers.get(question);
      if (!answers) {
        return false;
      } else {
        return answers.map(a => {
          if (a.hasSubQuestions()) {
            return this._areAllSubQuestionsAnswered(a.subQuestions, a.subQuestionMode);
          } else {
            return true;
          }
        }).reduce((a, b) => a && b, true);

      }
    }
  }

  _areAllSubQuestionsAnswered(subQuestions, subQuestionMode) {
    switch(subQuestionMode) {
      case SubQuestionModes.ANSWER_ALL:
        return subQuestions.every(q => this._isCompleted(q));
      case SubQuestionModes.ANSWER_ONE:
        return subQuestions.some(q => this._isCompleted(q));
      default:
        throw new Error('unknown subquestion mode ' + subQuestionMode);
    }
  }
}


export default ScoreCalculation;
