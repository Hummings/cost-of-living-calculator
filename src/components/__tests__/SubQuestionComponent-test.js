import Answer from '../../models/Answer';
import AnswerComponent from '../AnswerComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
import SubQuestionComponent from '../SubQuestionComponent';
import SubQuestionListComponent from '../SubQuestionListComponent';
import SubQuestionChoiceComponent from '../SubQuestionChoiceComponent';
import SubQuestionModes from '../../models/SubQuestionModes';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');


describe('SubQuestionComponent', () => {
  let scoreCalculation;
  let subQuestions;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
    subQuestions = Immutable.List.of(
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
    );
  });

  it('renders a SubQuestionListComponent if the mode is ANSWER_ALL', () => {
    const wrapper = shallow(
      <SubQuestionComponent
        subQuestions={subQuestions}
        scoreCalculation={scoreCalculation}
        level={ 1 }
        subQuestionMode={ SubQuestionModes.ANSWER_ALL }
        />
    );
    expect(wrapper.find(SubQuestionListComponent).length).toBe(1);
    expect(wrapper.find(SubQuestionChoiceComponent).length).toBe(0);
    const subQuestionList = wrapper.find(SubQuestionListComponent).get(0);
    expect(subQuestionList.props.subQuestions).toBe(subQuestions);
    expect(subQuestionList.props.scoreCalculation).toBe(scoreCalculation);
    expect(subQuestionList.props.level).toBe(2);
  });

  it('renders a SubQuestionChoiceComponent if the mode is ANSWER_ONE', () => {
    const wrapper = shallow(
      <SubQuestionComponent
        subQuestions={subQuestions}
        scoreCalculation={scoreCalculation}
        level={ 1 }
        subQuestionMode={ SubQuestionModes.ANSWER_ONE }
        />
    );
    expect(wrapper.find(SubQuestionListComponent).length).toBe(0);
    expect(wrapper.find(SubQuestionChoiceComponent).length).toBe(1);
    const subQuestionChoice = wrapper.find(SubQuestionChoiceComponent).get(0);
    expect(subQuestionChoice.props.subQuestions).toBe(subQuestions);
    expect(subQuestionChoice.props.scoreCalculation).toBe(scoreCalculation);
    expect(subQuestionChoice.props.level).toBe(2);
  });
});
