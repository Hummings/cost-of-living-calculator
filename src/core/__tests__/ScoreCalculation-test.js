import Answer from '../../models/Answer';
import EntrySet from '../EntrySet';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import ScoreCalculation from '../ScoreCalculation';
import SubQuestionModes from '../../models/SubQuestionModes';

import { List } from 'immutable';

jest.mock('../EntrySet');

describe('ScoreCalculation', () => {
  let entrySet;

  const makeCalculation = (...questions) => new ScoreCalculation(new Quiz({
    questions: List(questions),
  }), {
    entrySet: entrySet,
  });

  beforeEach(() => {
    entrySet = new EntrySet();
  });

  describe('onAnswer', () => {
    it('calls the callback when a question is answered', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
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
        answers: List.of(
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
    it('calls the callback for newly completed questions', () => {
      const callback = jest.fn();
       const q = new Question({
        title: 'q1',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });

      entrySet.isCompleted.mockReturnValue(false);
      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      entrySet.isCompleted.mockReturnValue(true);
      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      const newEntrySet = new EntrySet();
      newEntrySet.isCompleted.mockReturnValue(true);
      entrySet.recordAnswer.mockReturnValue(newEntrySet);
      entrySet.isCompleted.mockReturnValue(false);

      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(0));
      expect(callback).toHaveBeenCalled();
    });

    it('does not call callbacks for other completed questions', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const q1 = new Question({
        title: 'q1',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const q2 = new Question({
        title: 'q2',
        answers: List.of(
          new Answer({ text: 'kjasdlfk1', points: 2 }),
          new Answer({ text: '2l35iu', points: 3 }),
        )
      });

      const newEntrySet = new EntrySet();
      newEntrySet.isCompleted.mockReturnValue(true);
      entrySet.recordAnswer.mockReturnValue(newEntrySet);
      entrySet.isCompleted.mockImplementation(q => q === q1);

      makeCalculation(q1, q2)
        .onQuestionCompleted(q1, callback1)
        .onQuestionCompleted(q2, callback2)
        .recordAnswer(q1, q1.answers.get(0));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('chains callbacks on the same question', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      const newEntrySet = new EntrySet();
      newEntrySet.isCompleted.mockReturnValue(true);
      entrySet.recordAnswer.mockReturnValue(newEntrySet);
      entrySet.isCompleted.mockReturnValue(false);

      makeCalculation(q)
        .onQuestionCompleted(q, callback1)
        .onQuestionCompleted(q, callback2)
        .recordAnswer(q, q.answers.get(0));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });


  });

  describe('computeScore', () => {
    it('sums the score for all the quiz questions', () => {
      const q1 = new Question({
        title: 'q1',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const q2 = new Question({
        title: 'q2',
        answers: List.of(
          new Answer({ text: 'kjasdlfk1', points: 2 }),
          new Answer({ text: '2l35iu', points: 3 }),
        )
      });

      entrySet.computeQuestionScore
        .mockReturnValueOnce(34)
        .mockReturnValueOnce(105);

      expect(makeCalculation(q1, q2).computeScore()).toBe(34 + 105);
      expect(entrySet.computeQuestionScore).toHaveBeenCalledWith(q1);
      expect(entrySet.computeQuestionScore).toHaveBeenCalledWith(q2);
    });
  });

  describe('completeMultipleChoiceQuestion', () => {
    it('calls the question completed callback and records completion', () => {
      const callback = jest.fn();
      const question = new Question({
        isMultipleChoice: true,
        title: 'What kind of candy do you like?',
        answers: List.of(
          new Answer({ title: 'Snickers' }),
          new Answer({ title: 'Starburst' }),
          new Answer({ title: 'Twizzler' }),
          new Answer({ title: 'Three Musketeers' }),
        ),
      });

      makeCalculation(question)
        .onQuestionCompleted(question, callback)
        .completeMultipleChoiceQuestion(question);

      expect(callback).toHaveBeenCalled();
      expect(entrySet.recordCompletedQuestion).toHaveBeenCalledWith(question);
    });
  });

  describe('isSelected', () => {
    it('delegates to the entry set', () => {
      entrySet.isSelected.mockReturnValue(true);
      const question = new Question({
        isMultipleChoice: true,
        title: 'What kind of candy do you like?',
        answers: List.of(
          new Answer({ title: 'Snickers' }),
          new Answer({ title: 'Starburst' }),
          new Answer({ title: 'Twizzler' }),
          new Answer({ title: 'Three Musketeers' }),
        ),
      });

      expect(
        makeCalculation(question)
          .recordAnswer(question, question.answers.get(0))
          .isSelected(question, question.answers.get(0))
      ).toBe(true);

      expect(entrySet.isSelected).toHaveBeenCalledWith(question, question.answers.get(0));
    });
  });

  describe('clearCallbacks', () => {
    it('clears the callbacks', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
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
