import Answer from '../../models/Answer';
import SelectedAnswers from '../SelectedAnswers';
import Question from '../../models/Question';
import SubQuestionModes from '../../models/SubQuestionModes';

import { List } from 'immutable';

describe('SelectedAnswers', () => {
  let selectedAnswers;

  beforeEach(() => {
    selectedAnswers = new SelectedAnswers();
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
      expect(selectedAnswers.isCompleted(q)).toBe(false);
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
        selectedAnswers
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

      selectedAnswers = selectedAnswers.recordAnswer(sub1, sub1.answers.get(1));
      expect(selectedAnswers.isCompleted(q)).toBe(false);

      selectedAnswers = selectedAnswers.recordAnswer(sub2, sub2.answers.get(1));
      expect(selectedAnswers.isCompleted(q)).toBe(true);

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
        selectedAnswers
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

      selectedAnswers = selectedAnswers
        .recordAnswer(question, question.answers.get(1))
        .recordAnswer(question, question.answers.get(3));

      expect(selectedAnswers.isCompleted(question)).toBe(false);

      selectedAnswers = selectedAnswers.recordCompletedQuestion(question);

      expect(selectedAnswers.isCompleted(question)).toBe(true);
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
        selectedAnswers
          .recordAnswer(q, answerWithoutSubs)
          .isCompleted(q)
      ).toBe(true);

      expect(
        selectedAnswers
          .recordAnswer(q, answerWithSubs)
          .isCompleted(q)
      ).toBe(false);

      expect(
        selectedAnswers
          .recordAnswer(q, answerWithSubs)
          .recordAnswer(sub1, sub1.answers.get(0))
          .isCompleted(q)
      ).toBe(false);

      expect(
        selectedAnswers
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
        selectedAnswers
        .recordAnswer(q, answerWithoutSubs)
        .isCompleted(q)
      ).toBe(true);

      expect(
        selectedAnswers
        .recordAnswer(q, answerWithSubs)
        .isCompleted(q)
      ).toBe(false);

      expect(
        selectedAnswers
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

      expect(selectedAnswers.computeQuestionScore(basicQuestion)).toBe(0);
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
        selectedAnswers
          .recordAnswer(basicQuestion, basicQuestion.answers.get(0))
          .computeQuestionScore(basicQuestion)
      ).toBe(1);

      expect(
        selectedAnswers
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
        selectedAnswers
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
        selectedAnswers
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
        selectedAnswers
          .recordAnswer(sub1, sub1.answers.get(0))
          .recordAnswer(sub2, sub2.answers.get(1))
          .computeQuestionScore(questionWithSubs)
      ).toBe(2 + 56);
    });

    it('sums the points from subquestions of subquestions', () => {
      const question = new Question({
        title: 'hello',
        subQuestions: List.of(
          new Question({
            title: 'hasSubs',
            subQuestions: List.of(
              new Question({
                title: 'sub1',
                answers: List.of(
                  new Answer({
                    text: 'sub1answer1',
                    points: 1,
                  }),
                  new Answer({
                    text: 'sub1answer2',
                    points: 2,
                  }),
                )
              }),
              new Question({
                title: 'sub2',
                answers: List.of(
                  new Answer({
                    text: 'sub2answer1',
                    points: 3,
                  }),
                  new Answer({
                    text: 'sub2answer2',
                    points: 4,
                  }),
                )
              }),
            ),
          }),
        ),
      });
      const mainSub = question.subQuestions.get(0);
      const sub1 = mainSub.subQuestions.get(0);
      const sub2 = mainSub.subQuestions.get(1);

      expect(
        selectedAnswers
          .recordAnswer(sub1, sub1.answers.get(1))
          .recordAnswer(sub2, sub2.answers.get(1))
          .computeQuestionScore(question)
      ).toBe(2 + 4);
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
        selectedAnswers
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
        selectedAnswers
          .recordAnswer(questionWithAnswerSubs, answerWithSubs)
          .recordAnswer(answerSub1, answerSub1.answers.get(0))
          .recordAnswer(answerSub2, answerSub2.answers.get(1))
          .computeQuestionScore(questionWithAnswerSubs)
      ).toBe(91 + 56);
    });

    it('sums the points from subquestions of answer subquestions', () => {
      const question = new Question({
        title: 'questionWithAnswerSubs',
        answers: List.of(
          new Answer({
            subQuestions: List.of(
              new Question({
                title: 'hasSubs',
                subQuestions: List.of(
                  new Question({
                    title: 'sub1',
                    answers: List.of(
                      new Answer({
                        text: 'sub1answer1',
                        points: 1,
                      }),
                      new Answer({
                        text: 'sub1answer2',
                        points: 2,
                      }),
                    )
                  }),
                  new Question({
                    title: 'sub2',
                    answers: List.of(
                      new Answer({
                        text: 'sub2answer1',
                        points: 3,
                      }),
                      new Answer({
                        text: 'sub2answer2',
                        points: 4,
                      }),
                    )
                  }),
                ),
              }),
            ),
          })
        ),
      });
      const mainAnswer = question.answers.get(0);
      const answerSub = mainAnswer.subQuestions.get(0);
      const sub1 = answerSub.subQuestions.get(0);
      const sub2 = answerSub.subQuestions.get(1);

      expect(
        selectedAnswers
          .recordAnswer(question, mainAnswer)
          .recordAnswer(sub1, sub1.answers.get(1))
          .recordAnswer(sub2, sub2.answers.get(1))
          .computeQuestionScore(question)
      ).toBe(2 + 4);
    });

    it('multiplies other subquestion answers by the answer\'s multiplying subquestion', () => {
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
      const multiplier = new Question({
        title: 'sub2',
        id: 'mult',
        answers: List.of(
          new Answer({ text: '2', points: 2 }),
          new Answer({ text: '3', points: 3 }),
        ),
      });
      const doubling = multiplier.answers.get(0);
      const tripling = multiplier.answers.get(1);
      const answer = new Answer({
        text: 'wer',
        multiplyingSubQuestionId: 'mult',
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: List.of(answerSub1, answerSub2, multiplier),
      });
      const questionWithAnswerSubs = new Question({
        title: 'questionWithAnswerSubs',
        answers: List.of(answer),
      });

      expect(
        selectedAnswers
          .recordAnswer(questionWithAnswerSubs, answer)
          .recordAnswer(multiplier, doubling)
          .recordAnswer(answerSub1, answerSub1.answers.get(0))
          .recordAnswer(answerSub2, answerSub2.answers.get(1))
          .computeQuestionScore(questionWithAnswerSubs)
      ).toBe(2*(91 + 56));
      expect(
        selectedAnswers
          .recordAnswer(questionWithAnswerSubs, answer)
          .recordAnswer(multiplier, tripling)
          .recordAnswer(answerSub1, answerSub1.answers.get(0))
          .recordAnswer(answerSub2, answerSub2.answers.get(1))
          .computeQuestionScore(questionWithAnswerSubs)
      ).toBe(3*(91 + 56));
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

      expect(selectedAnswers.isSelected(q, a1)).toBe(false);

      expect(
        selectedAnswers
          .recordAnswer(q, a1)
          .isSelected(q, a2)
      ).toBe(false);

      expect(
        selectedAnswers
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

      selectedAnswers = selectedAnswers.recordAnswer(q, a2);

      expect(selectedAnswers.isSelected(q, a2)).toBe(true);
      expect(selectedAnswers.isCompleted(q)).toBe(true);

      selectedAnswers = selectedAnswers.deleteAnswer(q, a2);

      expect(selectedAnswers.isSelected(q, a2)).toBe(false);
      expect(selectedAnswers.isCompleted(q)).toBe(false);
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
        selectedAnswers
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

      expect(selectedAnswers.hasAnswer(question)).toBe(false);
      expect(
        selectedAnswers
          .recordAnswer(question, question.answers.get(0))
          .hasAnswer(question)
      ).toBe(true);
     expect(
        selectedAnswers
          .recordAnswer(question, question.answers.get(0))
          .hasAnswer(new Question())
      ).toBe(false);
    });
  });
});
