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
    expect(a1.props.question).toBe(question);
    expect(a1.props.scoreCalculation).toBe(scoreCalculation);
    expect(a1.props.level).toBe(0);

    expect(a2.props.answer).toBe(question.answers.get(1));
    expect(a2.props.question).toBe(question);
    expect(a2.props.scoreCalculation).toBe(scoreCalculation);
    expect(a2.props.level).toBe(0);
  });

});
