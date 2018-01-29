import Answer from '../../models/Answer';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';

import { shallow } from 'enzyme';

describe('QuestionComponent', () => {
  let question;
  let wrapper;

  beforeEach(() => {
    question = new Question({
      title: 'what\'s goin\' on?',
      answers: Immutable.List.of(
        new Answer({ text: 'nothin' }),
        new Answer({ text: 'somethin' }),
      ),
    });
    wrapper = mount(<QuestionComponent question={question} />);
  });


  it('renders the question\'s title', () => {
    expect(wrapper.find('h4').text()).toEqual('what\'s goin\' on?');
  });

  it('renders answers in a list', () => {
    const list = wrapper.find('ul.answers');
    expect(list.find('li.answer').length).toBe(2);
  });

  describe('an answer item', () => {
    it('is disabled if there is another selected answer', () => {
      wrapper.setState(
        { selectedAnswer: question.answers.get(1) },
      );
      const disabledAnswers = wrapper.find('li.answer.disabled');
      const enabledAnswers = wrapper.find('li.answer.enabled');
      expect(disabledAnswers.length).toBe(1);
      expect(enabledAnswers.length).toBe(1);
      expect(disabledAnswers.text()).toEqual('(I) nothin');
      expect(enabledAnswers.text()).toEqual('(II) somethin');
    });

    it('is not disabled if there is no answer selected', () => {
      const disabledAnswers = wrapper.find('li.answer.disabled');
      const enabledAnswers = wrapper.find('li.answer.enabled');
      expect(disabledAnswers.length).toBe(0);
      expect(enabledAnswers.length).toBe(2);
    });

    it('selects itself on click', () => {
      wrapper.find('li.answer').first().simulate('click');

      const disabledAnswers = wrapper.find('li.answer.disabled');
      const enabledAnswers = wrapper.find('li.answer.enabled');
      expect(disabledAnswers.length).toBe(1);
      expect(enabledAnswers.length).toBe(1);
      expect(enabledAnswers.text()).toEqual('(I) nothin');
      expect(disabledAnswers.text()).toEqual('(II) somethin');
    });
  });
});
