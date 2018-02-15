import Answer from '../../models/Answer';
import AnswerListComponent from '../AnswerListComponent';
import AnswerComponent from '../AnswerComponent';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
import SubQuestionComponent from '../SubQuestionComponent';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('QuestionComponent', () => {
  let question;
  let wrapper;
  let scoreCalculation;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
    question = new Question({
      title: 'what\'s goin\' on?',
      answers: Immutable.List.of(
        new Answer({ text: 'nothin' }),
        new Answer({ text: 'somethin' }),
      ),
    });
    wrapper = shallow(<QuestionComponent question={question} scoreCalculation={scoreCalculation} />);
  });


  it('renders the question\'s title', () => {
    expect(wrapper.find('h3').text()).toEqual('what\'s goin\' on?');
  });

  it('renders the question\'s title with a label', () => {
    wrapper = shallow(<QuestionComponent question={question} label='I' scoreCalculation={scoreCalculation} />);
    expect(wrapper.find('h3').text()).toEqual('(I) what\'s goin\' on?');
  });

  it('renders an answer list component', () => {
    expect(wrapper.find(AnswerListComponent).length).toBe(1);
    const answerComponent = wrapper.find(AnswerListComponent).get(0);
    expect(answerComponent.props.question).toBe(question);
    expect(answerComponent.props.level).toBe(0);
    expect(answerComponent.props.scoreCalculation).toBe(scoreCalculation);
 });

  it('does not render a subquestion component if there are no subquestions', () => {
    expect(wrapper.find(SubQuestionComponent).length).toBe(0);
  });

  it('renders a subquestion child component', () => {
    question = new Question({
      title: 'hello',
      subQuestions: Immutable.List.of(
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
      ),
    });
    expect(question.get('subQuestions').size).toBe(2);
    wrapper = shallow(<QuestionComponent question={question} scoreCalculation={scoreCalculation} />);
    expect(wrapper.find(SubQuestionComponent).length).toBe(1);
    expect(wrapper.find(AnswerListComponent).length).toBe(0);
    const subComponent = wrapper.find(SubQuestionComponent).get(0);
    expect(subComponent.props.subQuestions).toBe(question.subQuestions);
    expect(subComponent.props.scoreCalculation).toBe(scoreCalculation);
    expect(subComponent.props.level).toBe(0);
    expect(subComponent.props.subQuestionMode).toBe(question.subQuestionMode);
  });
});
