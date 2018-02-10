import Answer from '../../models/Answer';
import QuestionComponent from '../QuestionComponent';
import Immutable from 'immutable';
import Question from '../../models/Question';
import React from 'react';
import ScoreCalculation from '../../core/ScoreCalculation';
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
  });

  it('does not render a subquestion list if there are no subquestions', () => {
    expect(wrapper.find(SubQuestionListComponent).length).toBe(0);
  });

  it('renders subquestions as a child component', () => {
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
    const subQuestionList = wrapper.find(SubQuestionListComponent).get(0);
    expect(subQuestionList.props.subQuestions).toBe(question.subQuestions);
    expect(subQuestionList.props.scoreCalculation).toBe(scoreCalculation);
    expect(subQuestionList.props.level).toBe(1);
  });

  describe('an answer item', () => {
    it('is disabled if there is another selected answer', () => {
      wrapper.setState(
        { selectedAnswer: question.answers.get(1) },
      );
      const disabledAnswers = wrapper.find('li.answer.disabled');
      const enabledAnswers = wrapper.find('li.answer.enabled');
      expect(disabledAnswers.length).toBe(1);
      expect(enabledAnswers.length).toBe(1);
      expect(disabledAnswers.text()).toEqual('(a) nothin');
      expect(enabledAnswers.text()).toEqual('(b) somethin');
    });

    it('is not disabled if there is no answer selected', () => {
      const disabledAnswers = wrapper.find('li.answer.disabled');
      const enabledAnswers = wrapper.find('li.answer.enabled');
      expect(disabledAnswers.length).toBe(0);
      expect(enabledAnswers.length).toBe(2);
    });

    it('selects itself on click', () => {
      wrapper.find('li.answer').first().simulate('click');

      const disabledAnswers = wrapper.find('li.answer.disabled');
      const enabledAnswers = wrapper.find('li.answer.enabled');
      expect(disabledAnswers.length).toBe(1);
      expect(enabledAnswers.length).toBe(1);
      expect(enabledAnswers.text()).toEqual('(a) nothin');
      expect(disabledAnswers.text()).toEqual('(b) somethin');
    });

    it('calls scoreCalculation.recordAnswer on click', () => {
      expect(scoreCalculation.recordAnswer).not.toHaveBeenCalled();
      wrapper.find('li.answer').first().simulate('click');
      expect(scoreCalculation.recordAnswer).toHaveBeenCalledWith(
        question, question.answers.get(0)
      );
    });
  });
});
