import Answer from '../models/Answer';
import App from '../app';
import QuizComponent from '../components/QuizComponent';
import LoadingIndicator from '../components/LoadingIndicator';
import Immutable from 'immutable';
import Quiz from '../models/Quiz';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';

import { afterAllPromises } from '../test-setup';
import { shallow } from 'enzyme';

describe('App', () => {
  let promise;
  let resolve;
  let fetchQuestions;
  let wrapper;

  beforeEach(() => {
    promise = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve;
    });
    fetchQuestions = jest.fn().mockReturnValue(promise);
    wrapper = shallow(<App fetchQuestions={ fetchQuestions } />);
  });

  it('shows a loading indicator at first', () => {
    expect(wrapper.find(LoadingIndicator).length).toBe(1);
    expect(wrapper.find(QuizComponent).length).toBe(0);
  });

  it('renders the result of the question fetch', done => {
    const quiz = new Quiz();
    resolve(quiz);
    expect.assertions(4);

    afterAllPromises(() => {
      wrapper.update();
      expect(wrapper.find(LoadingIndicator).length).toBe(0);
      expect(wrapper.find(QuizComponent).length).toBe(1);
      expect(wrapper.find(QuizComponent).get(0).props.quiz).toBe(quiz);
      expect(wrapper.find(QuizComponent).get(0).props.initialScoreCalculation).toEqual(new ScoreCalculation(quiz));
      done();
    });
  });
});
