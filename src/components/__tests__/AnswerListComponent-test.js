import Answer from '../../models/Answer';
import AnswerListComponent from '../AnswerListComponent';
import Immutable from 'immutable';
import MultipleChoiceAnswerListComponent from '../MultipleChoiceAnswerListComponent';
import Question from '../../models/Question';
import React from 'react';
import SingleChoiceAnswerListComponent from '../SingleChoiceAnswerListComponent';
import ScoreCalculation from '../../core/ScoreCalculation';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');


describe('AnswerListComponent', () => {
  let scoreCalculation;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
  });

  it('renders a multiple choice list if the question is multiple choice', () => {
    const question = new Question({
      isMultipleChoice: true,
      answers: Immutable.List.of(
        new Answer()
      ),
    });
    const wrapper = shallow(
      <AnswerListComponent
        question={question}
        scoreCalculation={scoreCalculation}
        level={3}
      />
    );
    expect(wrapper.find(SingleChoiceAnswerListComponent).length).toBe(0);
    expect(wrapper.find(MultipleChoiceAnswerListComponent).length).toBe(1);
    const subComponent = wrapper.find(MultipleChoiceAnswerListComponent).get(0);
    expect(subComponent.props.question).toBe(question);
    expect(subComponent.props.scoreCalculation).toBe(scoreCalculation);
    expect(subComponent.props.level).toBe(3);
  });

  it('renders a single choice list if the question is not multiple choice', () => {
    const question = new Question({
      isMultipleChoice: false,
      answers: Immutable.List.of(
        new Answer()
      ),
    });
    const wrapper = shallow(
      <AnswerListComponent
        question={question}
        scoreCalculation={scoreCalculation}
        level={3}
      />
    );
    expect(wrapper.find(SingleChoiceAnswerListComponent).length).toBe(1);
    expect(wrapper.find(MultipleChoiceAnswerListComponent).length).toBe(0);
    const subComponent = wrapper.find(SingleChoiceAnswerListComponent).get(0);
    expect(subComponent.props.question).toBe(question);
    expect(subComponent.props.scoreCalculation).toBe(scoreCalculation);
    expect(subComponent.props.level).toBe(3);
  });
});
