import Answer from '../Answer';
import Immutable from 'immutable';
import Question from '../Question';
import SubQuestionModes from '../SubQuestionModes';

describe('Question', () => {

  describe('getId', () => {
    it('returns explicit ids', () => {
      const q = new Question({
        id: 'aksdjf2',
        title: 'the real question',
      });
      expect(q.getId()).toEqual('aksdjf2');
    });

    it('dasherizes the title if no id was specified', () => {
      const q = new Question({
        title: 'the real question',
      });
      expect(q.getId()).toEqual('the-real-question');
    });
  });


  describe('deserialize', () => {
    it('deserializes the title and answers', () => {
      const q = Question.deserialize({
        title: 'hello',
        answers: [
          {
            text: 'a1',
            points: 2,
          },
          {
            text: 'a2',
            points: 5,
          },
        ],
      });
      expect(q.get('title')).toEqual('hello');
      expect(q.get('answers')).toEqual(new Immutable.List([
        new Answer({ text: 'a1', points: 2 }),
        new Answer({ text: 'a2', points: 5 }),
      ]));
    });

    it('deserializes subQuestions', () => {
      const q = Question.deserialize({
        title: 'foobar',
        subQuestions: [
          {
            title: 'c1',
            answers: [
              { text: 'c1a1', points: 0 },
              { text: 'c1a2', points: 1 },
            ],
          },
          {
            title: 'c2',
            answers: [
              { text: 'c2a1', points: 2 },
              { text: 'c2a2', points: 3 },
            ],
          },
        ],
      });
      expect(q.get('subQuestions')).toEqual(new Immutable.List([
        new Question({
          title: 'c1',
          answers: new Immutable.List([
            new Answer({ text: 'c1a1', points: 0 }),
            new Answer({ text: 'c1a2', points: 1 }),
          ]),
        }),
        new Question({
          title: 'c2',
          answers: new Immutable.List([
            new Answer({ text: 'c2a1', points: 2 }),
            new Answer({ text: 'c2a2', points: 3 }),
          ]),
        }),
      ]));
    });

    it('requires either subquestions or answers', () => {
      expect(() => {
        Question.deserialize({ title: 'hello', answers: [], subQuestions: [] });
      }).toThrow();
    });

    it('does not allow both subQuestions and answers', () => {
      expect(() => {
        Question.deserialize({
          title: 'hello',
          answers: [
            { text: 'asafd', points: 3 },
          ],
          subQuestions: [
            { title: 'hqwe', answers: [ { text: '3113jk', points: 193 } ] },
          ],
        });
      }).toThrow();
    });

    it('defaults subQuestionMode to ANSWER_ALL', () => {
      const q = Question.deserialize({
        answers: [{ text: 'a', points: 2}],
      });
      expect(q.subQuestionMode).toBe(SubQuestionModes.ANSWER_ALL);
    });

    it('deserializes the subquestion mode string', () => {
      const q = Question.deserialize({
        subQuestionMode: 'ANSWER_ONE',
        answers: [{ text: 'a', points: 2}],
      });
      expect(q.subQuestionMode).toBe(SubQuestionModes.ANSWER_ONE);
    });
  });

  describe('hasSubQuestions', () => {
    it('is false if there are no subquestions', () => {
      const question = new Question();
      expect(question.hasSubQuestions()).toBe(false);
    });

    it('is true if there are subquestions', () => {
      const question = new Question({
        subQuestions: Immutable.List.of(
          new Question(),
          new Question()
        ),
      });
      expect(question.hasSubQuestions()).toBe(true);
    });
  });

  describe('hasAnswers', () => {
    it('is false if there are no answers', () => {
      const question = new Question();
      expect(question.hasAnswers()).toBe(false);
    });

    it('is true if there are answers', () => {
      const question = new Question({
        answers: Immutable.List.of(
          new Answer(),
          new Answer()
        ),
      });
      expect(question.hasAnswers()).toBe(true);
    });
  });


  describe('isCompleted', () => {
    it('is true if the question has been answered and has no subquestions', () => {
      const q = new Question({ title: 'hello' });
      expect(q.isCompleted(Immutable.Map())).toBe(false);
      expect(q.isCompleted(Immutable.Map([[q, new Answer()]]))).toBe(true);
    });

    it('is true if all the subquestions have been answered', () => {
      const q1 = new Question({ title: 'q1' });
      const q2 = new Question({ title: 'q2' });
      const question = new Question({
        title: 'queestion',
        subQuestions: Immutable.List.of(q1, q2),
      });
      expect(question.isCompleted(Immutable.Map([ [question, new Answer()] ]))).toBe(false);
      expect(question.isCompleted(Immutable.Map([ [q1, new Answer()] ]))).toBe(false);
      expect(question.isCompleted(Immutable.Map([ [q1, new Answer()], [q2, new Answer()] ]))).toBe(true);
    });

    it('is true if one subquestion has been answered and the subQuestionMode is ANSWER_ONE', () => {
      const q = new Question({
        title: 'hello',
        subQuestionMode: SubQuestionModes.ANSWER_ONE,
        subQuestions: Immutable.List.of(
          new Question({
            title: 'sub1',
            answers: Immutable.List.of(
              new Answer({ text: 'asdf', points: 1 }),
              new Answer({ text: 'hijk', points: 1 }),
            ),
          }),
          new Question({
            title: 'sub2',
            answers: Immutable.List.of(
              new Answer({ text: '123j', points: 1 }),
              new Answer({ text: '345', points: 1 }),
            ),
          }),
        ),
      });
      expect(q.isCompleted(Immutable.Map())).toBe(false);
      const selectedAnswers = Immutable.Map([
        [ q.subQuestions.get(0), q.subQuestions.get(0).answers.get(1) ],
      ]);
      expect(q.isCompleted(selectedAnswers)).toBe(true);
    });

    it('checks if the answer\'s subquestions have been answered', () => {
      const basicAnswer = new Answer({ text: 'hi', points: 3 });
      const answerWithSubQuestions = new Answer({
        subQuestionMode: SubQuestionModes.ANSWER_ALL,
        subQuestions: Immutable.List.of(
          new Question({
            title: 'sub1',
            answers: Immutable.List.of(
              new Answer({ text: 'asdf', points: 1 }),
              new Answer({ text: 'hijk', points: 1 }),
            ),
          }),
          new Question({
            title: 'sub2',
            answers: Immutable.List.of(
              new Answer({ text: '123j', points: 1 }),
              new Answer({ text: '345', points: 1 }),
            ),
          }),
        ),
      });
      const question = new Question({
        title: 'hello',
        answers: Immutable.List.of(
          basicAnswer,
          answerWithSubQuestions,
        ),
      });

      expect(question.isCompleted(Immutable.Map([[ question, basicAnswer ]]))).toBe(true);
      expect(question.isCompleted(Immutable.Map([[ question, answerWithSubQuestions ]]))).toBe(false);
      expect(question.isCompleted(Immutable.Map([
        [ question, answerWithSubQuestions ],
        [ answerWithSubQuestions.subQuestions.get(0), answerWithSubQuestions.subQuestions.get(0).answers.get(0) ],
      ]))).toBe(false);
      expect(question.isCompleted(Immutable.Map([
        [ question, answerWithSubQuestions ],
        [ answerWithSubQuestions.subQuestions.get(0), answerWithSubQuestions.subQuestions.get(0).answers.get(0) ],
        [ answerWithSubQuestions.subQuestions.get(1), answerWithSubQuestions.subQuestions.get(1).answers.get(0) ],
      ]))).toBe(true);
    });
  });

  describe('computeScore', () => {
    const noSubQuestions = new Question({
      title: 'wassup',
      answers: Immutable.List.of(
        new Answer({ text: 'nothin', points: 1 }),
        new Answer({ text: 'somethin', points: 2 }),
      ),
    });
    const withSubQuestions = new Question({
      title: 'who dat?',
      subQuestions: Immutable.List.of(
        new Question({
          title: 'yo momma?',
          answers: Immutable.List.of(
            new Answer({ text: 'yes', points: 2 }),
            new Answer({ text: 'no', points: 1 }),
          ),
        }),
        new Question({
          title: 'yo daddy?',
          answers: Immutable.List.of(
            new Answer({ text: 'yes', points: 2 }),
            new Answer({ text: 'no', points: 1 }),
          ),
        }),
      ),
    });
    const sub1 = withSubQuestions.subQuestions.get(0);
    const sub2 = withSubQuestions.subQuestions.get(1);

    it('returns 0 if the question is not completed', () => {
      const selectedAnswers = Immutable.Map([
        [ sub1, sub1.answers.get(0) ]
      ]);
      expect(noSubQuestions.computeScore(selectedAnswers)).toBe(0);
      expect(withSubQuestions.computeScore(selectedAnswers)).toBe(0);
    });

    it('returns the selected answer\'s points if there are no subquestions', () => {
      const answer = noSubQuestions.answers.get(1);
      const selectedAnswers = Immutable.Map([
        [ noSubQuestions, answer ]
      ]);
      expect(noSubQuestions.computeScore(selectedAnswers)).toBe(answer.points);
    });

    it('sums the subquestions\' points', () => {
      const a1 = sub1.answers.get(0);
      const a2 = sub1.answers.get(1);
      const selectedAnswers = Immutable.Map([
        [ sub1, a1 ],
        [ sub2, a2 ],
      ]);
      expect(withSubQuestions.computeScore(selectedAnswers)).toBe(
        a1.points + a2.points
      );
    });
  });
});
