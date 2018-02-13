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
    expect(wrapper.find(SubQuestionComponent).length).toBe(0);
  });

  it('records the answer on click', () => {
    expect(scoreCalculation.recordAnswer).not.toHaveBeenCalled();
    wrapper.find('.selectable').simulate('click');
    expect(scoreCalculation.recordAnswer).toHaveBeenCalledWith(question, answer);
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
        question={question}
        answer={answer}
        scoreCalculation={scoreCalculation}
        level={ 3 }
        isSelected={ false }
        />
    );
    expect(wrapper.find(SubQuestionComponent).length).toBe(0);

    wrapper = shallow(
      <AnswerComponent
        question={question}
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
