import Answer from '../../models/Answer';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
import SubQuestionListComponent from '../SubQuestionListComponent';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('SubQuestionListComponent', () => {
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
      <SubQuestionListComponent
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

    expect(scoreCalculation.onAnswer).toHaveBeenCalledWith(expect.any(Function));
  });

  it('labels the active sub question with a class ', () => {
    expect(wrapper.find('li.subQuestion.active').length).toBe(1);
    expect(wrapper.find('li.subQuestion.not-active').length).toBe(1);

    let active = wrapper.find('li.subQuestion.active');
    let notActive = wrapper.find('li.subQuestion.not-active');

    expect(active.find(QuestionComponent).get(0).props.question).toBe(
      subQuestions.get(0)
    );
    expect(notActive.find(QuestionComponent).get(0).props.question).toBe(
      subQuestions.get(1)
    );

    wrapper.instance().incrementActiveSubQuestion();
    wrapper.update();

    active = wrapper.find('li.subQuestion.active');
    notActive = wrapper.find('li.subQuestion.not-active');

    expect(active.find(QuestionComponent).get(0).props.question).toBe(
      subQuestions.get(1)
    );
    expect(notActive.find(QuestionComponent).get(0).props.question).toBe(
      subQuestions.get(0)
    );
  });

  it('increments the active subquestion with scoreCalculation.onAnswer', () => {
    const getActiveSubQuestion = () => {
      return wrapper
        .find('li.subQuestion.active')
        .find(QuestionComponent)
        .get(0)
        .props
        .question;
    };

    expect(getActiveSubQuestion()).toBe(subQuestions.get(0));
    const onAnswer = scoreCalculation.onAnswer.mock.calls[0][0];

    onAnswer();
    wrapper.update();
    expect(getActiveSubQuestion()).toBe(subQuestions.get(1));
  });
});
