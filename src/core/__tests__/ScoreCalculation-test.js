import Answer from '../../models/Answer';
import Immutable from 'immutable';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import ScoreCalculation from '../ScoreCalculation';
import SubQuestionModes from '../../models/SubQuestionModes';

describe('ScoreCalculation', () => {
  const makeCalculation = (...questions) => new ScoreCalculation(new Quiz({
    questions: Immutable.List(questions),
  }));

  describe('onAnswer', () => {
    it('calls the callback when a question is answered', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const callback = jest.fn();
      let calculation = makeCalculation(q)
        .onAnswer(callback);

      expect(callback).not.toHaveBeenCalled();

      calculation = calculation.recordAnswer(q, q.answers.get(0));
      expect(callback).toHaveBeenCalledWith(calculation);
    });

    it('chains callbacks', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      makeCalculation(q)
        .onAnswer(callback1)
        .onAnswer(callback2)
        .recordAnswer(q, q.answers.get(0));

      expect(callback1).toHaveBeenCalledWith(expect.any(ScoreCalculation));
      expect(callback2).toHaveBeenCalledWith(expect.any(ScoreCalculation));
    });
  });

  describe('onQuestionCompleted', () => {
   it('calls the callback when the question is answered if there are no subquestions', () => {
      const callback = jest.fn();
      const q = new Question({
        title: 'q',
        answers: Immutable.List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(1));

      expect(callback).toHaveBeenCalled();
    });

    it('does not call callbacks for other completed questions', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const q1 = new Question({
        title: 'q1',
        answers: Immutable.List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const q2 = new Question({
        title: 'q2',
        answers: Immutable.List.of(
          new Answer({ text: 'kjasdlfk1', points: 2 }),
          new Answer({ text: '2l35iu', points: 3 }),
        )
      });

      let calculation = makeCalculation(q1, q2)
        .onQuestionCompleted(q1, callback1)
        .onQuestionCompleted(q2, callback2);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      calculation = calculation.recordAnswer(q1, q1.answers.get(0));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      callback1.mockReset();

      calculation.recordAnswer(q2, q2.answers.get(0));
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('calls the callback when all subquestions are answered', () => {
      const callback = jest.fn();
      const sub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const q = new Question({
        title: 'hello',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(
          sub1,
          sub2,
        ),
      });

      let calculation = makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(sub1, sub1.answers.get(1));

      expect(callback).not.toHaveBeenCalled();

      calculation.recordAnswer(sub2, sub2.answers.get(0));
      expect(callback).toHaveBeenCalled();
    });

    it('calls the callback when one subquestion is answered if the subquestion mode is ANSWER_ONE', () => {
      const callback = jest.fn();
      const sub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const q = new Question({
        title: 'hello',
        subQuestionMode: SubQuestionModes.ANSWER_ONE,
        subQuestions: Immutable.List.of(
          sub1,
          sub2,
        ),
      });

      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(sub1, sub1.answers.get(1));
      expect(callback).toHaveBeenCalled();
    });

    it('calls the callback when all subquestions of answers have been completed', () => {
      const sub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(sub1, sub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const q = new Question({
        title: 'hello',
        answers: Immutable.List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });
      const callback = jest.fn();
      let calculation = makeCalculation(q)
        .onQuestionCompleted(q, callback);

      calculation.recordAnswer(q, answerWithoutSubs);
      expect(callback).toHaveBeenCalled();
      callback.mockReset();

      calculation = calculation.recordAnswer(q, answerWithSubs);
      expect(callback).not.toHaveBeenCalled();

      calculation = calculation.recordAnswer(sub1, sub1.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      calculation = calculation.recordAnswer(sub2, sub2.answers.get(0));
      expect(callback).toHaveBeenCalled();
    });

    it('calls the callback when one subquestions of an answer with ANSWER_ONE subquestion mode has been answered', () => {
      const sub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ONE,
        subQuestions: Immutable.List.of(sub1, sub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const q = new Question({
        title: 'hello',
        answers: Immutable.List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });
      const callback = jest.fn();
      let calculation = makeCalculation(q)
        .onQuestionCompleted(q, callback);

      calculation.recordAnswer(q, answerWithoutSubs);
      expect(callback).toHaveBeenCalled();
      callback.mockReset();

      calculation = calculation.recordAnswer(q, answerWithSubs);
      expect(callback).not.toHaveBeenCalled();

      calculation = calculation.recordAnswer(sub1, sub1.answers.get(0));
      expect(callback).toHaveBeenCalled();
    });

    it('chains callbacks on the same question', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const q = new Question({
        title: 'I got no subquestions',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      makeCalculation(q)
        .onQuestionCompleted(q, callback1)
        .onQuestionCompleted(q, callback2)
        .recordAnswer(q, q.answers.get(0));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('computeScore', () => {
    it('is 0 if no questions have been answered', () => {
      const basicQuestion = new Question({
        title: 'basicQuestion',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      expect(
        makeCalculation(basicQuestion).computeScore()
      ).toBe(0);
    });

    it('returns the points for a basic question', () => {
      const basicQuestion = new Question({
        title: 'basicQuestion',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      let calculation = makeCalculation(basicQuestion);
      expect(
        calculation
          .recordAnswer(basicQuestion, basicQuestion.answers.get(0))
          .computeScore()
      ).toBe(1);

      expect(
        calculation
          .recordAnswer(basicQuestion, basicQuestion.answers.get(1))
          .computeScore()
      ).toBe(2);
    });

    it('sums the points for all selected answers', () => {
      const multipleChoice = new Question({
        title: 'basicQuestion',
        isMultipleChoice: true,
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      let calculation = makeCalculation(multipleChoice);
      expect(
        calculation
          .recordAnswer(multipleChoice, multipleChoice.answers.get(0))
          .recordAnswer(multipleChoice, multipleChoice.answers.get(1))
          .computeScore()
      ).toBe(1 + 2);
    });

    it('sums the points for subquestions', () => {
       const sub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 2 }),
          new Answer({ text: 'hijk', points: 9 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 23 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
       const questionWithSubs = new Question({
        title: 'questionWithSubs',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(
          sub1,
          sub2,
        ),
      });

      let calculation = makeCalculation(questionWithSubs);
      expect(
        calculation
          .recordAnswer(sub1, sub1.answers.get(0))
          .recordAnswer(sub2, sub2.answers.get(1))
          .computeScore()
      ).toBe(2 + 56);
    });

    it('returns the points for an answer without subs even if other answers have subs', () => {
      const answerSub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 91 }),
          new Answer({ text: 'hijk', points: 87 }),
        ),
      });
      const answerSub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 34 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(answerSub1, answerSub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const questionWithAnswerSubs = new Question({
        title: 'questionWithAnswerSubs',
        answers: Immutable.List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });

      let calculation = makeCalculation(questionWithAnswerSubs);
      expect(
        calculation
          .recordAnswer(questionWithAnswerSubs, answerWithoutSubs)
          .computeScore()
      ).toBe(2);
    });

    it('sums the points from answer subquestions', () => {
      const answerSub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 91 }),
          new Answer({ text: 'hijk', points: 87 }),
        ),
      });
      const answerSub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 34 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(answerSub1, answerSub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const questionWithAnswerSubs = new Question({
        title: 'questionWithAnswerSubs',
        answers: Immutable.List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });

      let calculation = makeCalculation(questionWithAnswerSubs);
      expect(
        calculation
          .recordAnswer(questionWithAnswerSubs, answerWithSubs)
          .recordAnswer(answerSub1, answerSub1.answers.get(0))
          .recordAnswer(answerSub2, answerSub2.answers.get(1))
          .computeScore()
      ).toBe(91 + 56);
    });

    it('sums up the scores for all the quiz questions', () => {
      const basicQuestion = new Question({
        title: 'basicQuestion',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
       const sub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 2 }),
          new Answer({ text: 'hijk', points: 9 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 23 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
      const questionWithSubs = new Question({
        title: 'questionWithSubs',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(
          sub1,
          sub2,
        ),
      });

      const answerSub1 = new Question({
        title: 'sub1',
        answers: Immutable.List.of(
          new Answer({ text: 'asdf', points: 91 }),
          new Answer({ text: 'hijk', points: 87 }),
        ),
      });
      const answerSub2 = new Question({
        title: 'sub2',
        answers: Immutable.List.of(
          new Answer({ text: '123j', points: 34 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(answerSub1, answerSub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const questionWithAnswerSubs = new Question({
        title: 'questionWithAnswerSubs',
        answers: Immutable.List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });

      let calculation = makeCalculation(basicQuestion, questionWithSubs, questionWithAnswerSubs);
      expect(
        calculation
          .recordAnswer(basicQuestion, basicQuestion.answers.get(0))
          .recordAnswer(sub1, sub1.answers.get(0))
          .recordAnswer(sub2, sub2.answers.get(1))
          .recordAnswer(questionWithAnswerSubs, answerWithSubs)
          .recordAnswer(answerSub1, answerSub1.answers.get(1))
          .recordAnswer(answerSub2, answerSub2.answers.get(1))
          .computeScore()
      ).toBe( 1 + 2 + 56 + 87 + 56 );
    });
  });

  describe('clearCallbacks', () => {
    it('clears the callbacks', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: Immutable.List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const answerCallback = jest.fn();
      const questionCallback = jest.fn();

      makeCalculation(q)
        .onAnswer(answerCallback)
        .onQuestionCompleted(q, questionCallback)
        .clearCallbacks()
        .recordAnswer(q, q.answers.get(0));

      expect(answerCallback).not.toHaveBeenCalled();
      expect(questionCallback).not.toHaveBeenCalled();
    });
  });
});
