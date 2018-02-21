import Answer from '../../models/Answer';
import AnswerComponent from '../AnswerComponent';
import MultipleChoiceAnswerListComponent from '../MultipleChoiceAnswerListComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');


describe('MultipleChoiceAnswerListComponent', () => {

  let question;
  let scoreCalculation;
  let wrapper;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
    question = new Question({
      isMultipleChoice: true,
      title: 'what\'s goin\' on?',
      answers: Immutable.List.of(
        new Answer({ text: 'nothin' }),
        new Answer({ text: 'somethin' }),
      ),
    });
    wrapper = shallow(
      <MultipleChoiceAnswerListComponent
        question={question}
        scoreCalculation={scoreCalculation}
      />
    );
  });

  it('renders answers in a list', () => {
    const list = wrapper.find('ul.answers');
    expect(list.find(AnswerComponent).length).toBe(2);
    const a1 = list.find(AnswerComponent).get(0);
    const a2 = list.find(AnswerComponent).get(1);

    expect(a1.props.answer).toBe(question.answers.get(0));
    expect(a1.props.question).toBe(question);
    expect(a1.props.scoreCalculation).toBe(scoreCalculation);
    expect(a1.props.level).toBe(0);

    expect(a2.props.answer).toBe(question.answers.get(1));
    expect(a2.props.question).toBe(question);
    expect(a2.props.scoreCalculation).toBe(scoreCalculation);
    expect(a2.props.level).toBe(0);
  });

  it('indicates selected answers via the checkbox', () => {
    scoreCalculation.isSelected.mockImplementation(a => {
      return a === question.answers.get(0)
    });
     wrapper = shallow(
      <MultipleChoiceAnswerListComponent
        question={question}
        scoreCalculation={scoreCalculation}
      />
    );
    expect(wrapper.find('input[type="checkbox"]').length).toBe(2)
    expect(scoreCalculation.isSelected).toHaveBeenCalledWith(question.answers.get(0));
    expect(scoreCalculation.isSelected).toHaveBeenCalledWith(question.answers.get(1));
    expect(wrapper.find('input[type="checkbox"]').get(0).props.checked).toBe(true);
    expect(wrapper.find('input[type="checkbox"]').get(1).props.checked).toBe(false);
  });

  it('renders a button to complete the question', () => {
    expect(wrapper.find('li.complete-question').length).toBe(1);
		wrapper.find('li.answer').first().simulate('click');
		expect(scoreCalculation.completeMultipleChoiceQuestion).not.toHaveBeenCalled();

    wrapper.find('li.complete-question').simulate('click');
		expect(scoreCalculation.completeMultipleChoiceQuestion).toHaveBeenCalledWith(question);
  });
});
