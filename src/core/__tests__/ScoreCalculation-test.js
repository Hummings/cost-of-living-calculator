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
    it('calls the callback when a question is completed', () => {
      const callback = jest.fn();
      const withCallback = calculation.onQuestionCompleted(callback);

      expect(callback).not.toHaveBeenCalled();

      withCallback.recordAnswer(noSubQuestions, noSubQuestions.answers.get(0));

      expect(callback).toHaveBeenCalled();

      callback.mockReset();

      withCallback.recordAnswer(sub1, sub1.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      withCallback
        .recordAnswer(sub1, sub1.answers.get(0))
        .recordAnswer(sub2, sub2.answers.get(1));
      expect(callback).toHaveBeenCalled();
    });

    it('chains callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      calculation
        .onQuestionCompleted(callback1)
        .onQuestionCompleted(callback2)
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


});
