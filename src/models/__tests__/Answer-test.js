import Answer from '../Answer';
import Immutable from 'immutable';
import Question from '../Question';
import SubQuestionModes from '../SubQuestionModes';


describe('Answer', () => {

  describe('getId', () => {
    it('returns explicit ids', () => {
      const a = new Answer({
        id: 'aksdjf2',
        text: 'the real answer',
      });
      expect(a.getId()).toEqual('aksdjf2');
    });

    it('dasherizes the text if no id was specified', () => {
      const a = new Answer({
        text: 'the real answer',
      });
      expect(a.getId()).toEqual('the-real-answer');
    });
  });

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

    it('deserializes subQuestions', () => {
      const answer = Answer.deserialize({
        subQuestions: [
          {
            title: 'q1',
            answers: [
              { text: 'q1a1', points: 0 },
              { text: 'q1a2', points: 5 },
            ],
          },
          {
            title: 'q2',
            subQuestions: [
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
      expect(answer.get('subQuestions')).toEqual(new Immutable.List([
        new Question({
          title: 'q1',
          answers: new Immutable.List([
            new Answer({ text: 'q1a1', points: 0 }),
            new Answer({ text: 'q1a2', points: 5 }),
          ]),
        }),
        new Question({
          title: 'q2',
          subQuestions: new Immutable.List([
            new Question({
              title: 'cats and dogs',
              answers: new Immutable.List([
                new Answer({ text: 'c1a1', points: 0 }),
                new Answer({ text: 'c1a2', points: 345 }),
              ]),
            }),
            new Question({
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

    it('defaults subQuestionMode to ANSWER_ALL', () => {
      const answer = Answer.deserialize({
        text: 'hello',
        points: 5,
      });
      expect(answer.subQuestionMode).toBe(SubQuestionModes.ANSWER_ALL);
    });

    it('deserializes the subQuestionMode string', () => {
      const answer = Answer.deserialize({
        text: 'hello',
        points: 5,
        subQuestionMode: 'ANSWER_ONE',
      });
      expect(answer.subQuestionMode).toBe(SubQuestionModes.ANSWER_ONE);
    });
  });

  describe('hasSubQuestions', () => {
    it('is false if the answer has no sub questions', () => {
      expect(new Answer().hasSubQuestions()).toBe(false);
    });

    it('is true if the answer has sub questions', () => {
      const answer = new Answer({
        subQuestions: Immutable.List.of(
          new Question(),
        )
      });
      expect(answer.hasSubQuestions()).toBe(true);
    });
  });
});
