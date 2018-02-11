import Answer from '../../models/Answer';
import AnswerComponent from '../AnswerComponent';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
import SubQuestionChoiceComponent from '../SubQuestionChoiceComponent';
import SubQuestionListComponent from '../SubQuestionListComponent';

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
    expect(wrapper.find('h4').text()).toEqual('what\'s goin\' on?');
  });

  it('renders the question\'s title with a label', () => {
    wrapper = shallow(<QuestionComponent question={question} label='I' scoreCalculation={scoreCalculation} />);
    expect(wrapper.find('h4').text()).toEqual('(I) what\'s goin\' on?');
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

    expect(a2.props.answer).toBe(question.answers.get(1));
    expect(a2.props.question).toBe(question);
    expect(a2.props.scoreCalculation).toBe(scoreCalculation);
  });

  it('does not render a subquestion list if there are no subquestions', () => {
    expect(wrapper.find(SubQuestionListComponent).length).toBe(0);
  });

  it('renders the subquestion list as a child component', () => {
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
    expect(wrapper.find(SubQuestionListComponent).length).toBe(1);
    expect(wrapper.find(SubQuestionChoiceComponent).length).toBe(0);
    const subQuestionList = wrapper.find(SubQuestionListComponent).get(0);
    expect(subQuestionList.props.subQuestions).toBe(question.subQuestions);
    expect(subQuestionList.props.scoreCalculation).toBe(scoreCalculation);
    expect(subQuestionList.props.level).toBe(1);
  });

  it('renders a subquestion choice child component if the mode is ANSWER_ONE', () => {
    question = new Question({
      title: 'hello',
      subQuestionMode: Question.SubQuestionModes.ANSWER_ONE,
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
    expect(wrapper.find(SubQuestionListComponent).length).toBe(0);
    expect(wrapper.find(SubQuestionChoiceComponent).length).toBe(1);
    const subQuestionChoice = wrapper.find(SubQuestionChoiceComponent).get(0);
    expect(subQuestionChoice.props.subQuestions).toBe(question.subQuestions);
    expect(subQuestionChoice.props.scoreCalculation).toBe(scoreCalculation);
    expect(subQuestionChoice.props.level).toBe(1);
  });
});
