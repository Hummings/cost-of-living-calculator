import Answer from '../models/Answer';
import App from '../app';
import CardList from '../components/CardList';
import LoadingIndicator from '../components/LoadingIndicator';
import Immutable from 'immutable';
import QuestionList from '../models/QuestionList';
import React from 'react';

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
    expect(wrapper.find(CardList).length).toBe(0);
  });

  it('renders the result of the question fetch', done => {
    const questionList = new QuestionList();
    resolve(questionList);
    expect.assertions(3);

    afterAllPromises(() => {
      wrapper.update();
      expect(wrapper.find(LoadingIndicator).length).toBe(0);
      expect(wrapper.find(CardList).length).toBe(1);
      expect(wrapper.find(CardList).get(0).props.questionList).toBe(questionList);
      done();
    });
  });
});
