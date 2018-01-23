import Answer from '../Answer';
import Category from '../Category';
import Immutable from 'immutable';
import Question from '../Question';


describe('Answer', () => {

  describe('deserialize', () => {
    it('deserializes the text and points', () => {
      const answer = Answer.deserialize({
        text: 'hello',
        points: 5,
      });
      expect(answer).toEqual(new Answer({
        text: 'hello',
        points: 5
      }));
    });

    it('deserializes subquestions', () => {
      const answer = Answer.deserialize({
        subquestions: [
          {
            title: 'q1',
            answers: [
              { text: 'q1a1', points: 0 },
              { text: 'q1a2', points: 5 },
            ],
          },
          {
            title: 'q2',
            categories: [
              {
                title: 'cats and dogs',
                answers: [
                  { text: 'c1a1', points: 0 },
                  { text: 'c1a2', points: 345 },
                ],
              },
              {
                title: 'foobarasdf',
                answers: [
                  { text: 'c2a1', points: 12 },
                  { text: 'c2a2', points: 73 },
                ],
              },
            ],
          },
        ],
      });
      expect(answer.get('subquestions')).toEqual(new Immutable.List([
        new Question({
          title: 'q1',
          answers: new Immutable.List([
            new Answer({ text: 'q1a1', points: 0 }),
            new Answer({ text: 'q1a2', points: 5 }),
          ]),
        }),
        new Question({
          title: 'q2',
          categories: new Immutable.List([
            new Category({
              title: 'cats and dogs',
              answers: new Immutable.List([
                new Answer({ text: 'c1a1', points: 0 }),
                new Answer({ text: 'c1a2', points: 345 }),
              ]),
            }),
            new Category({
              title: 'foobarasdf',
              answers: new Immutable.List([
                new Answer({ text: 'c2a1', points: 12 }),
                new Answer({ text: 'c2a2', points: 73 }),
              ]),
            }),
          ]),
        }),
      ]));
    });
  });

});
