import Answer from '../../models/Answer';
import QuestionCard from '../QuestionCard';
import Immutable from 'immutable';
import Question from '../../models/Question';
import QuestionComponent from '../QuestionComponent';
import React from 'react';

import { shallow } from 'enzyme';

describe('QuestionCard', () => {
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
    wrapper = shallow(<QuestionCard question={question} />);
  });

  it('renders a question component', () => {
    expect(wrapper.find(QuestionComponent).length).toBe(1);
		const qc = wrapper.find(QuestionComponent).get(0);
    expect(qc.props.question).toBe(question);
  });

  it('is active by default', () => {
    expect(wrapper.find('div.active').length).toBe(1);
    expect(wrapper.find('div.not-active').length).toBe(0);
  });

  it('indicates if it is not active', () => {
    wrapper = shallow(<QuestionCard question={question} isActive={false} />);
    expect(wrapper.find('div.active').length).toBe(0);
    expect(wrapper.find('div.not-active').length).toBe(1);
  });

  it('passes the onAnswer prop down to the QuestionComponent', () => {
    const onAnswer = jest.fn();
    wrapper = shallow(<QuestionCard question={ question } onAnswer={ onAnswer } />);
    expect(wrapper.find(QuestionComponent).get(0).props.onAnswer).toBe(onAnswer);
  });

  it('passes the onComplete prop down to the QuestionComponent', () => {
    const onComplete = jest.fn();
    wrapper = shallow(<QuestionCard question={ question } onComplete={ onComplete } />);
    expect(wrapper.find(QuestionComponent).get(0).props.onComplete).toBe(onComplete);
  });
});


