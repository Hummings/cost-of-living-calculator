import Answer from '../Answer';
import Immutable from 'immutable';
import Question from '../Question';

describe('Question', () => {
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
  });
});
