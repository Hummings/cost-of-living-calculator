import Answer from '../../models/Answer';
import AnswerComponent from '../AnswerComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('AnswerComponent', () => {
  let answer;
  let question;
  let wrapper;
  let scoreCalculation;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
    answer = new Answer({ text: 'True', points: 1 });
    question = new Question({
      title: 'True or False?',
      answers: Immutable.List.of(
        answer,
        new Answer({ text: 'False', points: 0 }),
      ),
    });
    wrapper = shallow(
      <AnswerComponent
        question={question}
        answer={answer}
        scoreCalculation={scoreCalculation}
      />
    );
  });

  it('renders the answer text with a label', () => {
    expect(wrapper.text()).toEqual('(a) True');
  });

  it('records the answer on click', () => {
    expect(scoreCalculation.recordAnswer).not.toHaveBeenCalled();
    wrapper.find('p').simulate('click');
    expect(scoreCalculation.recordAnswer).toHaveBeenCalledWith(question, answer);
  });
});
