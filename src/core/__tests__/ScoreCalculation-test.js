import Answer from '../../models/Answer';
import Immutable from 'immutable';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import ScoreCalculation from '../ScoreCalculation';

describe('ScoreCalculation', () => {
  const quiz = new Quiz({
    questions: Immutable.List.of(
      new Question({
        title: 'I got no subquestions',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      }),
      new Question({
        title: 'I got subquestions',
        subQuestions: Immutable.List.of(
          new Question({
            title: 'sub1',
            answers: Immutable.List.of(
              new Answer({ text: 'c', points: 3 }),
              new Answer({ text: 'd', points: 4 }),
            ),
          }),
          new Question({
            title: 'sub2',
            answers: Immutable.List.of(
              new Answer({ text: 'e', points: 5 }),
              new Answer({ text: 'f', points: 6 }),
            ),
          }),
        ),
      }),
    ),
  });
  const noSubQuestions = quiz.questions.get(0);
  const hasSubQuestions = quiz.questions.get(1);
  const sub1 = hasSubQuestions.subQuestions.get(0);
  const sub2 = hasSubQuestions.subQuestions.get(1);

  const calculation = new ScoreCalculation(quiz);

  describe('onAnswer', () => {
    it('calls the callback when a question is answered', () => {
      const callback = jest.fn();
      const withCallback = calculation.onAnswer(callback);

      expect(callback).not.toHaveBeenCalled();

      calculation.recordAnswer(noSubQuestions, noSubQuestions.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      withCallback.recordAnswer(noSubQuestions, noSubQuestions.answers.get(0));
      expect(callback).toHaveBeenCalledWith(expect.any(ScoreCalculation));
      expect(callback).not.toHaveBeenCalledWith(calculation);
    });

    it('chains callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      calculation
        .onAnswer(callback1)
        .onAnswer(callback2)
        .recordAnswer(noSubQuestions, noSubQuestions.answers.get(0));

      expect(callback1).toHaveBeenCalledWith(expect.any(ScoreCalculation));
      expect(callback2).toHaveBeenCalledWith(expect.any(ScoreCalculation));
    });
  });

  describe('onQuestionCompleted', () => {
    it('calls the callback when the question is completed', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const withCallback = calculation
        .onQuestionCompleted(noSubQuestions, callback1)
        .onQuestionCompleted(hasSubQuestions, callback2);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      withCallback.recordAnswer(noSubQuestions, noSubQuestions.answers.get(0));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      callback1.mockReset();

      withCallback.recordAnswer(sub1, sub1.answers.get(0));
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      withCallback
        .recordAnswer(sub1, sub1.answers.get(0))
        .recordAnswer(sub2, sub2.answers.get(1));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('chains callbacks on the same question', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      calculation
        .onQuestionCompleted(hasSubQuestions, callback1)
        .onQuestionCompleted(hasSubQuestions, callback2)
        .recordAnswer(sub1, sub1.answers.get(0))
        .recordAnswer(sub2, sub2.answers.get(1));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('computeScore', () => {
    it('sums up the scores for all the quiz questions', () => {
     const selectedAnswers = Immutable.Map([
        [ noSubQuestions, noSubQuestions.answers.get(0) ],
        [ sub1, sub1.answers.get(0) ],
        [ sub2, sub2.answers.get(0) ]
      ]);
      const expectedScore = noSubQuestions.computeScore(selectedAnswers) + hasSubQuestions.computeScore(selectedAnswers);
      const score = calculation
        .recordAnswer(noSubQuestions, noSubQuestions.answers.get(0))
        .recordAnswer(sub1, sub1.answers.get(0))
        .recordAnswer(sub2, sub2.answers.get(0))
        .computeScore();

      expect(score).toEqual(expectedScore);
    });
  });

  describe('clearCallbacks', () => {
    it('clears the callbacks', () => {
      const answerCallback = jest.fn();
      const questionCallback = jest.fn();

      calculation
        .onAnswer(answerCallback)
        .onQuestionCompleted(noSubQuestions, questionCallback)
        .clearCallbacks()
        .recordAnswer(noSubQuestions, noSubQuestions.answers.get(0));

      expect(answerCallback).not.toHaveBeenCalled();
      expect(questionCallback).not.toHaveBeenCalled();
    });
  });
});
