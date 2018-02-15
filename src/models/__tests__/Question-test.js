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
});
