import Answer from '../Answer';
import Immutable from 'immutable';
import Question from '../Question';
import QuestionList from '../QuestionList';

describe('QuestionList', () => {

  describe('deserialize', () => {
    it('deserializes version and questions', () => {
      const ql = QuestionList.deserialize({
        version: 'v2',
        questions: [
          {
            title: 'hello',
            answers: [
              {
                text: 'hi',
                points: 2,
              },
              {
                text: 'yo',
                points: 3,
              }
            ],
          },
          {
            title: 'what\'s up doc',
            answers: [
              {
                text: 'nothin',
                points: 0,
              },
              {
                text: 'somethin',
                points: 1,
              },
            ],
          },
        ],
      });
      expect(ql.version).toEqual('v2');
      expect(ql.questions).toEqual(Immutable.List.of(
        new Question({
          title: 'hello',
          answers: Immutable.List.of(
            new Answer({
              text: 'hi',
              points: 2,
            }),
            new Answer({
              text: 'yo',
              points: 3,
            }),
          ),
        }),
        new Question({
          title: 'what\'s up doc',
          answers: Immutable.List.of(
            new Answer({
              text: 'nothin',
              points: 0,
            }),
            new Answer({
              text: 'somethin',
              points: 1,
            }),
          ),
        }),
      ));
    });
  });
});
