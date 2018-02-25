import Answer from '../../models/Answer';
import EntrySet from '../EntrySet';
import Question from '../../models/Question';
import SubQuestionModes from '../../models/SubQuestionModes';

import { List } from 'immutable';

describe('EntrySet', () => {
  let entrySet;

  beforeEach(() => {
    entrySet = new EntrySet();
  });

  describe('isCompleted', () => {
   it('is false when the question has not been answered', () => {
      const q = new Question({
        title: 'q',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      expect(entrySet.isCompleted(q)).toBe(false);
    });


   it('is true when the question is answered if there are no subquestions', () => {
      const q = new Question({
        title: 'q',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      expect(
        entrySet
        .recordAnswer(q, q.answers.get(1))
        .isCompleted(q)
      ).toBe(true);
    });

    it('is true when all subquestions are answered', () => {
      const sub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const q = new Question({
        title: 'hello',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: List.of(
          sub1,
          sub2,
        ),
      });

      entrySet = entrySet.recordAnswer(sub1, sub1.answers.get(1));
      expect(entrySet.isCompleted(q)).toBe(false);

      entrySet = entrySet.recordAnswer(sub2, sub2.answers.get(1));
      expect(entrySet.isCompleted(q)).toBe(true);

    });

    it('is true when one subquestion is answered if the subquestion mode is ANSWER_ONE', () => {
      const sub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const q = new Question({
        title: 'hello',
        subQuestionMode: SubQuestionModes.ANSWER_ONE,
        subQuestions: List.of(
          sub1,
          sub2,
        ),
      });

      expect(
        entrySet
          .recordAnswer(sub1, sub1.answers.get(1))
          .isCompleted(q)
      ).toBe(true);
    });

    it('is false for multiple choice questions until #recordCompletedQuestion', () => {
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

      entrySet = entrySet
        .recordAnswer(question, question.answers.get(1))
        .recordAnswer(question, question.answers.get(3));

      expect(entrySet.isCompleted(question)).toBe(false);

      entrySet = entrySet.recordCompletedQuestion(question);

      expect(entrySet.isCompleted(question)).toBe(true);
    });

    it('is true when all subquestions of answers have been completed', () => {
      const sub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: List.of(sub1, sub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const q = new Question({
        title: 'hello',
        answers: List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });
      expect(
        entrySet
          .recordAnswer(q, answerWithoutSubs)
          .isCompleted(q)
      ).toBe(true);

      expect(
        entrySet
          .recordAnswer(q, answerWithSubs)
          .isCompleted(q)
      ).toBe(false);

      expect(
        entrySet
          .recordAnswer(q, answerWithSubs)
          .recordAnswer(sub1, sub1.answers.get(0))
          .isCompleted(q)
      ).toBe(false);

      expect(
        entrySet
          .recordAnswer(q, answerWithSubs)
          .recordAnswer(sub1, sub1.answers.get(0))
          .recordAnswer(sub2, sub2.answers.get(1))
          .isCompleted(q)
      ).toBe(true);
    });

    it('is true when one subquestions of an answer with ANSWER_ONE subquestion mode has been answered', () => {
      const sub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 1 }),
          new Answer({ text: 'hijk', points: 1 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 1 }),
          new Answer({ text: '345', points: 1 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ONE,
        subQuestions: List.of(sub1, sub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const q = new Question({
        title: 'hello',
        answers: List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });

      expect(
        entrySet
        .recordAnswer(q, answerWithoutSubs)
        .isCompleted(q)
      ).toBe(true);

      expect(
        entrySet
        .recordAnswer(q, answerWithSubs)
        .isCompleted(q)
      ).toBe(false);

      expect(
        entrySet
        .recordAnswer(q, answerWithSubs)
        .recordAnswer(sub1, sub1.answers.get(1))
        .isCompleted(q)
      ).toBe(true);
    });
  });

  describe('computeQuestionScore', () => {
    it('is 0 if the question has not been answered', () => {
      const basicQuestion = new Question({
        title: 'basicQuestion',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      expect(entrySet.computeQuestionScore(basicQuestion)).toBe(0);
    });

    it('returns the points for a basic question', () => {
      const basicQuestion = new Question({
        title: 'basicQuestion',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      expect(
        entrySet
          .recordAnswer(basicQuestion, basicQuestion.answers.get(0))
          .computeQuestionScore(basicQuestion)
      ).toBe(1);

      expect(
        entrySet
          .recordAnswer(basicQuestion, basicQuestion.answers.get(1))
          .computeQuestionScore(basicQuestion)
      ).toBe(2);
    });

    it('does not double the points if an answer is recorded twice', () => {
      const basicQuestion = new Question({
        title: 'basicQuestion',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      expect(
        entrySet
          .recordAnswer(basicQuestion, basicQuestion.answers.get(0))
          .recordAnswer(basicQuestion, basicQuestion.answers.get(0))
          .computeQuestionScore(basicQuestion)
      ).toBe(1);
    });


    it('sums the points for all selected answers', () => {
      const multipleChoice = new Question({
        title: 'basicQuestion',
        isMultipleChoice: true,
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      expect(
        entrySet
          .recordAnswer(multipleChoice, multipleChoice.answers.get(0))
          .recordAnswer(multipleChoice, multipleChoice.answers.get(1))
          .recordCompletedQuestion(multipleChoice)
          .computeQuestionScore(multipleChoice)
      ).toBe(1 + 2);
    });

    it('sums the points for subquestions', () => {
       const sub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 2 }),
          new Answer({ text: 'hijk', points: 9 }),
        ),
      });
      const sub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 23 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
       const questionWithSubs = new Question({
        title: 'questionWithSubs',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: List.of(
          sub1,
          sub2,
        ),
      });

      expect(
        entrySet
          .recordAnswer(sub1, sub1.answers.get(0))
          .recordAnswer(sub2, sub2.answers.get(1))
          .computeQuestionScore(questionWithSubs)
      ).toBe(2 + 56);
    });

    it('returns the points for an answer without subs even if other answers have subs', () => {
      const answerSub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 91 }),
          new Answer({ text: 'hijk', points: 87 }),
        ),
      });
      const answerSub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 34 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: List.of(answerSub1, answerSub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const questionWithAnswerSubs = new Question({
        title: 'questionWithAnswerSubs',
        answers: List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });

      expect(
        entrySet
          .recordAnswer(questionWithAnswerSubs, answerWithoutSubs)
          .computeQuestionScore(questionWithAnswerSubs)
      ).toBe(2);
    });

    it('sums the points from answer subquestions', () => {
      const answerSub1 = new Question({
        title: 'sub1',
        answers: List.of(
          new Answer({ text: 'asdf', points: 91 }),
          new Answer({ text: 'hijk', points: 87 }),
        ),
      });
      const answerSub2 = new Question({
        title: 'sub2',
        answers: List.of(
          new Answer({ text: '123j', points: 34 }),
          new Answer({ text: '345', points: 56 }),
        ),
      });
      const answerWithSubs = new Answer({
        text: 'wer',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: List.of(answerSub1, answerSub2),
      });
      const answerWithoutSubs = new Answer({
        text: '3q2342',
        points: 2,
      });
      const questionWithAnswerSubs = new Question({
        title: 'questionWithAnswerSubs',
        answers: List.of(
          answerWithSubs,
          answerWithoutSubs,
        ),
      });

      expect(
        entrySet
          .recordAnswer(questionWithAnswerSubs, answerWithSubs)
          .recordAnswer(answerSub1, answerSub1.answers.get(0))
          .recordAnswer(answerSub2, answerSub2.answers.get(1))
          .computeQuestionScore(questionWithAnswerSubs)
      ).toBe(91 + 56);
    });
  });

  describe('isSelected', () => {
    it('indicates if the answer is selected', () => {
      const q = new Question({
        title: 'q',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const a1 = q.answers.get(0);
      const a2 = q.answers.get(1);

      expect(entrySet.isSelected(q, a1)).toBe(false);

      expect(
        entrySet
          .recordAnswer(q, a1)
          .isSelected(q, a2)
      ).toBe(false);

      expect(
        entrySet
          .recordAnswer(q, a1)
          .isSelected(q, a1)
      ).toBe(true);
    });
  });

  describe('deleteAnswer', () => {
    it('deletes the answer', () => {
      const q = new Question({
        title: 'q',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const a1 = q.answers.get(0);
      const a2 = q.answers.get(1);

      entrySet = entrySet.recordAnswer(q, a2);

      expect(entrySet.isSelected(q, a2)).toBe(true);
      expect(entrySet.isCompleted(q)).toBe(true);

      entrySet = entrySet.deleteAnswer(q, a2);

      expect(entrySet.isSelected(q, a2)).toBe(false);
      expect(entrySet.isCompleted(q)).toBe(false);
    });

    it('preserves completed multiple choice questions', () => {
      const q = new Question({
        title: 'q',
        isMultipleChoice: true,
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const a1 = q.answers.get(0);
      const a2 = q.answers.get(1);

      expect(
        entrySet
          .recordAnswer(q, a1)
          .recordCompletedQuestion(q)
          .deleteAnswer(q, a1)
          .isCompleted(q)
      ).toBe(true);
    });
  });


  describe('hasAnswer', () => {
    it('indicates if the question has an answer selected', () => {
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

      expect(entrySet.hasAnswer(question)).toBe(false);
      expect(
        entrySet
          .recordAnswer(question, question.answers.get(0))
          .hasAnswer(question)
      ).toBe(true);
     expect(
        entrySet
          .recordAnswer(question, question.answers.get(0))
          .hasAnswer(new Question())
      ).toBe(false);
    });
  });
});
