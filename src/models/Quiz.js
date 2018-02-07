import Immutable from 'immutable';
import Question from './Question';
import Summary from './Summary';

const Quiz = Immutable.Record({
  version: 'v1',
  questions: new Immutable.List(),
  summary: new Summary(),
  answeredQuestions: new Immutable.Map(),
});

Quiz.deserialize = json => {
  return new Quiz({
    version: json.version || 'v1',
    questions: new Immutable.List((json.questions ||[]).map(Question.deserialize)),
    summary: Summary.deserialize(json.summary || {}),
  });
};

Object.assign(Quiz.prototype, {
  withAnswerSelected(question, answer) {
    if (!question) {
      throw new Error('question is required');
    }
    if (!answer) {
      throw new Error('answer is required');
    }
    return new Quiz({
      version: this.version,
      questions: this.questions,
      summary: this.summary,
      answeredQuestions: this.answeredQuestions.set(question, answer),
    });
  },

  getResult() {
    const score = this.answeredQuestions
      .valueSeq()
      .map(a => a.points)
      .reduce((a, b) => a + b, 0);
    return this.summary.getResultForScore(score);
  }
});

export default Quiz;
