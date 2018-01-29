import Answer from '../../models/Answer';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';

import { shallow, mount } from 'enzyme';

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
    wrapper = shallow(<QuestionComponent question={question} />);
  });


  it('renders the question\'s title', () => {
    expect(wrapper.find('h4').text()).toEqual('what\'s goin\' on?');
  });

  it('renders the question\'s title with a label', () => {
    wrapper = shallow(<QuestionComponent question={question} label='I' />);
    expect(wrapper.find('h4').text()).toEqual('(I) what\'s goin\' on?');
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
      expect(disabledAnswers.text()).toEqual('(a) nothin');
      expect(enabledAnswers.text()).toEqual('(b) somethin');
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
      expect(enabledAnswers.text()).toEqual('(a) nothin');
      expect(disabledAnswers.text()).toEqual('(b) somethin');
    });
  });

  describe('a subQuestion item', () => {
    beforeEach(() => {
      question = new Question({
        title: 'hello',
        subQuestions: Immutable.List.of(
          new Question({
            title: 'who\'s there?',
            answers: Immutable.List.of(
              new Answer({ text: 'Big Bird' }),
              new Answer({ text: 'Mr. Strawberry' }),
            ),
          }),
          new Question({
            title: 'what time is it?',
            answers: Immutable.List.of(
              new Answer({ text: 'early' }),
              new Answer({ text: 'late' }),
            ),
          }),
        ),
      });
      expect(question.get('subQuestions').size).toBe(2);
      wrapper = shallow(<QuestionComponent question={question} />);
    });

    it('is rendered recursively', () => {
      expect(wrapper.find('div.level0').length).toBe(1);
      expect(wrapper.find('div.level0 > h4').text()).toEqual('hello');

      expect(wrapper.find('ul.subQuestions').length).toBe(1);
      expect(wrapper.find('li.subQuestion').length).toBe(2);

      expect(wrapper.find(QuestionComponent).length).toBe(2);
      expect(wrapper.find(QuestionComponent).get(0).props.label).toEqual('I');
      expect(wrapper.find(QuestionComponent).get(0).props.level).toEqual(1);
      expect(wrapper.find(QuestionComponent).get(1).props.label).toEqual('II');
      expect(wrapper.find(QuestionComponent).get(1).props.level).toEqual(1);
    });
  });
});
