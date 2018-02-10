import Answer from '../../models/Answer';
import QuestionCard from '../QuestionCard';
import Immutable from 'immutable';
import Question from '../../models/Question';
import QuestionComponent from '../QuestionComponent';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('QuestionCard', () => {
  let question;
  let wrapper;
  let scoreCalculation;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
    question = new Question({
      title: 'what\'s goin\' on?',
      answers: Immutable.List.of(
        new Answer({ text: 'nothin' }),
        new Answer({ text: 'somethin' }),
      ),
    });
    wrapper = shallow(<QuestionCard question={question} scoreCalculation={ scoreCalculation } />);
  });

  it('renders a question component', () => {
    expect(wrapper.find(QuestionComponent).length).toBe(1);
		const qc = wrapper.find(QuestionComponent).get(0);
    expect(qc.props.question).toBe(question);
    expect(qc.props.scoreCalculation).toBe(scoreCalculation);
  });

  it('is active by default', () => {
    expect(wrapper.find('div.active').length).toBe(1);
    expect(wrapper.find('div.not-active').length).toBe(0);
  });

  it('indicates if it is not active', () => {
    wrapper = shallow(<QuestionCard question={question} isActive={false} scoreCalculation={scoreCalculation} />);
    expect(wrapper.find('div.active').length).toBe(0);
    expect(wrapper.find('div.not-active').length).toBe(1);
  });
});


