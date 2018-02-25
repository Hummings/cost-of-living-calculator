import Answer from '../../models/Answer';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
import SubQuestionChoiceComponent from '../SubQuestionChoiceComponent';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('SubQuestionChoiceComponent', () => {
  let subQuestions;
  let wrapper;
  let scoreCalculation;
  let level;

  beforeEach(() => {
    level = 2;
    scoreCalculation = new ScoreCalculation();
    subQuestions = Immutable.List.of(
      new Question({
        title: 'what\'s goin\' on?',
        answers: Immutable.List.of(
          new Answer({ text: 'nothin' }),
          new Answer({ text: 'somethin' }),
        ),
      }),
      new Question({
        title: 'who\'s there?',
        answers: Immutable.List.of(
          new Answer({ text: 'banana' }),
          new Answer({ text: 'orange' }),
        ),
      }),
    );
    wrapper = shallow(
      <SubQuestionChoiceComponent
        subQuestions={subQuestions}
        scoreCalculation={scoreCalculation}
        level={ level }
      />
    );
  });

  it('renders all the sub questions', () => {
    expect(wrapper.find(QuestionComponent).length).toBe(2);
    expect(wrapper.find(QuestionComponent).get(0).props.label).toEqual('I');
    expect(wrapper.find(QuestionComponent).get(0).props.level).toEqual(level);
    expect(wrapper.find(QuestionComponent).get(0).props.scoreCalculation).toBe(scoreCalculation);
    expect(wrapper.find(QuestionComponent).get(1).props.label).toEqual('II');
    expect(wrapper.find(QuestionComponent).get(1).props.level).toEqual(level);
    expect(wrapper.find(QuestionComponent).get(1).props.scoreCalculation).toBe(scoreCalculation);

    expect(wrapper.find('li.subQuestion.active').length).toBe(2);
    expect(scoreCalculation.onChange).not.toHaveBeenCalled();
  });
});
