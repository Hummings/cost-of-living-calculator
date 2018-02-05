import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import QuestionList from '../models/QuestionList';

import { fetchQuestions } from '../api';

describe('api', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  describe('fetchQuestions', () => {
    it('fetches the questions and deserializes the response', done => {
      const data = {
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
      };
      mock.onGet('/questions.json').reply(200, data);
      expect.assertions(1);

      fetchQuestions().then(questionList => {
        expect(questionList).toEqual(QuestionList.deserialize(data));
        done();
      });
    });
  });
});
