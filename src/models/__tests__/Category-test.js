import Answer from '../Answer';
import Category from '../Category';
import Immutable from 'immutable';

describe('Category', () => {

  describe('deserialize', () => {
    it('deserializes the title and answers', () => {
      const category = Category.deserialize({
        title: 'hello',
        answers: [
          {
            text: 'a1',
            points: 2,
          },
          {
            text: 'a2',
            points: 3,
          },
        ],
      });
      expect(category.get('title')).toEqual('hello');
      expect(category.get('answers')).toEqual(new Immutable.List([
        new Answer({ text: 'a1', points: 2 }),
        new Answer({ text: 'a2', points: 3 }),
      ]));
    });
  });
});
