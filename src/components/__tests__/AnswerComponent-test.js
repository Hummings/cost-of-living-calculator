import Answer from '../../models/Answer';
import AnswerComponent from '../AnswerComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
import SubQuestionComponent from '../SubQuestionComponent';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('AnswerComponent', () => {
  let answer;
  let wrapper;
  let selectAnswer;
  let scoreCalculation;

  beforeEach(() => {
    selectAnswer = jest.fn();
    scoreCalculation = new ScoreCalculation();
    answer = new Answer({ text: 'True', points: 1 });
    wrapper = shallow(
      <AnswerComponent
        answer={answer}
        scoreCalculation={scoreCalculation}
        selectAnswer={selectAnswer}
      />
    );
  });

  it('renders the answer text', () => {
    expect(wrapper.text().trim()).toEqual('True');
  });

  it('renders the label before answer text', () => {
    wrapper = shallow(
      <AnswerComponent
        label="(a)"
        answer={answer}
        scoreCalculation={scoreCalculation}
      />
    );
    expect(wrapper.text()).toEqual('(a) True');
  });

  it('calls the selectAnswer prop on click', () => {
    expect(scoreCalculation.recordAnswer).not.toHaveBeenCalled();
    expect(selectAnswer).not.toHaveBeenCalled();
    wrapper.find('.selectable').simulate('click');
    expect(scoreCalculation.recordAnswer).not.toHaveBeenCalled();
    expect(selectAnswer).toHaveBeenCalled();
  });

  it('does not render subquestions if there are none', () => {
    wrapper = shallow(
      <AnswerComponent
        answer={answer}
        scoreCalculation={scoreCalculation}
        isSelected={true}
      />
    );
    expect(wrapper.find(SubQuestionComponent).length).toBe(0);
  });

  it('renders the answer subquestions when selected', () => {
    answer = new Answer({
      subQuestions: Immutable.List.of(
        new Question({ title: 'sub1' }),
        new Question({ title: 'sub2' }),
      ),
    });

    wrapper = shallow(
      <AnswerComponent
        answer={answer}
        scoreCalculation={scoreCalculation}
        level={ 3 }
        isSelected={ false }
        />
    );
    expect(wrapper.find(SubQuestionComponent).length).toBe(0);

    wrapper = shallow(
      <AnswerComponent
        answer={answer}
        scoreCalculation={scoreCalculation}
        level={ 3 }
        isSelected={ true }
        />
    );

    expect(wrapper.find(SubQuestionComponent).length).toBe(1);

    const subComponent = wrapper.find(SubQuestionComponent).get(0);
    expect(subComponent.props.subQuestions).toBe(answer.subQuestions);
    expect(subComponent.props.subQuestionMode).toBe(answer.subQuestionMode);
    expect(subComponent.props.level).toBe(3);
    expect(subComponent.props.scoreCalculation).toBe(scoreCalculation)
  });
});
