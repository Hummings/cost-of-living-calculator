import Answer from '../../models/Answer';
import AnswerComponent from '../AnswerComponent';
import AnswerListComponent from '../AnswerListComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');


describe('AnswerListComponent', () => {

  let question;
  let scoreCalculation;
  let wrapper;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
    question = new Question({
      title: 'what\'s goin\' on?',
      answers: Immutable.List.of(
        new Answer({ text: 'nothin' }),
        new Answer({ text: 'somethin' }),
      ),
    });
    wrapper = shallow(<AnswerListComponent question={question} scoreCalculation={scoreCalculation} />);
  });

  it('renders answers in a list', () => {
    const list = wrapper.find('ul.answers');
    expect(list.find('li.answer').length).toBe(2);
    expect(list.find(AnswerComponent).length).toBe(2);
    const a1 = list.find(AnswerComponent).get(0);
    const a2 = list.find(AnswerComponent).get(1);

    expect(a1.props.answer).toBe(question.answers.get(0));
    expect(a1.props.label).toEqual('(a)');
    expect(a1.props.level).toBe(0);
    expect(a1.props.scoreCalculation).toBe(scoreCalculation);

    expect(a2.props.answer).toBe(question.answers.get(1));
    expect(a2.props.label).toEqual('(b)');
    expect(a2.props.level).toBe(0);
    expect(a2.props.scoreCalculation).toBe(scoreCalculation);
  });

  it('records the answer via the selectAnswer prop', () => {
    expect(scoreCalculation.recordAnswer).not.toHaveBeenCalled();

    let selectAnswer = wrapper.find(AnswerComponent).get(0).props.selectAnswer;
    expect(selectAnswer).toBeInstanceOf(Function);

    selectAnswer();

    expect(scoreCalculation.recordAnswer).toHaveBeenCalledWith(question, question.answers.get(0));
    expect(scoreCalculation.recordAnswer.mock.calls.length).toBe(1);

    scoreCalculation.recordAnswer.mockReset();

    selectAnswer = wrapper.find(AnswerComponent).get(1).props.selectAnswer;
    selectAnswer();
    expect(scoreCalculation.recordAnswer).toHaveBeenCalledWith(question, question.answers.get(1));
    expect(scoreCalculation.recordAnswer.mock.calls.length).toBe(1);

  });

  it('indicates selected answers via prop', () => {
    scoreCalculation.isSelected.mockImplementation((q, a) => a === question.answers.get(0));

    wrapper = shallow(<AnswerListComponent question={question} scoreCalculation={scoreCalculation} />);

    expect(wrapper.find(AnswerComponent).get(0).props.isSelected).toBe(true);
    expect(wrapper.find(AnswerComponent).get(1).props.isSelected).toBe(false);
  });

  it('indicates inactive answers', () => {
    scoreCalculation.hasAnswer.mockReturnValue(true);
    scoreCalculation.isSelected.mockImplementation((q, a) => a === question.answers.get(0));

    wrapper = shallow(<AnswerListComponent question={question} scoreCalculation={scoreCalculation} />);

    expect(wrapper.find('li.answer.active').length).toBe(1);
    expect(wrapper.find('li.answer.not-active').length).toBe(1);
    const activeAnswerComponent = wrapper.find('li.answer.active').find(AnswerComponent).get(0);
    expect(activeAnswerComponent.props.answer).toBe(question.answers.get(0));
  });

  it('does not mark answers as inactive if the question does not have an answer selected', () => {
    scoreCalculation.hasAnswer.mockReturnValue(false);
    scoreCalculation.isSelected.mockReturnValue(false);

    wrapper = shallow(<AnswerListComponent question={question} scoreCalculation={scoreCalculation} />);

    expect(wrapper.find('li.answer.active').length).toBe(2);
    expect(wrapper.find('li.answer.not-active').length).toBe(0);
  });
});
