import Answer from '../../models/Answer';
import Card from '../Card';
import Immutable from 'immutable';
import Question from '../../models/Question';
import QuestionComponent from '../QuestionComponent';
import React from 'react';

import { shallow } from 'enzyme';

describe('Card', () => {
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
    wrapper = shallow(<Card question={question} />);
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
    wrapper = shallow(<Card question={question} isActive={false} />);
    expect(wrapper.find('div.active').length).toBe(0);
    expect(wrapper.find('div.not-active').length).toBe(1);
  });

  it('passes the onAnswer prop down to the QuestionComponent', () => {
    const onAnswer = jest.fn();
    wrapper = shallow(<Card question={ question } onAnswer={ onAnswer } />);
    expect(wrapper.find(QuestionComponent).get(0).props.onAnswer).toBe(onAnswer);
  });
});


