import Answer from '../../models/Answer';
import QuizComponent from '../QuizComponent';
import QuestionCard from '../QuestionCard';
import Immutable from 'immutable';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import React from 'react';

import { shallow } from 'enzyme';

describe('QuizComponent', () => {
  let quiz;
  let wrapper;

  beforeEach(() => {
    quiz = new Quiz({
      questions: Immutable.List.of(
        new Question({
          title: 'hello',
          answers: Immutable.List.of(
            new Answer({
              text: 'hi',
              points: 2,
            }),
            new Answer({
              text: 'yo',
              points: 3,
            }),
          ),
        }),
        new Question({
          title: 'what\'s up doc',
          answers: Immutable.List.of(
            new Answer({
              text: 'nothin',
              points: 0,
            }),
            new Answer({
              text: 'somethin',
              points: 1,
            }),
          ),
        }),
      ),
    });

    wrapper = shallow(<QuizComponent initialQuiz={ quiz } />);
  });

  it('renders all the questions', () => {
    expect(wrapper.find(QuestionCard).length).toBe(2);
    const card1 = getQuestionCard(0);
    const card2 = getQuestionCard(1);

    expect(card1.props.question).toBe(quiz.questions.get(0));
    expect(card2.props.question).toBe(quiz.questions.get(1));
  });

  it('indicates which question is active', () => {
    expect(getQuestionCard(0).props.isActive).toBe(true);
    expect(getQuestionCard(1).props.isActive).toBe(false);

    wrapper.setState({ activeQuestionCard: 1 });

    expect(getQuestionCard(0).props.isActive).toBe(false);
    expect(getQuestionCard(1).props.isActive).toBe(true);
  });

  it('increments active card on answer via prop function', () => {
    const onAnswer = getQuestionCard(0).props.onAnswer
    expect(wrapper.state('activeQuestionCard')).toBe(0);

    expect(onAnswer).toBeInstanceOf(Function);

    onAnswer(
      quiz.questions.get(0),
      quiz.questions.get(0).answers.get(0)
    );

    expect(wrapper.state('activeQuestionCard')).toBe(1);
  });

  it('keeps track of the selected answers via prop function', () => {
    const onAnswer1 = getQuestionCard(0).props.onAnswer
    const onAnswer2 = getQuestionCard(1).props.onAnswer
    const question1 = quiz.questions.get(0)
    const question2 = quiz.questions.get(1)
    expect(onAnswer1).toBeInstanceOf(Function);
    expect(onAnswer2).toBeInstanceOf(Function);

    onAnswer1(question1, question1.answers.get(1));
    onAnswer2(question2, question2.answers.get(0));

    expect(wrapper.state('quiz').answeredQuestions.get(question1))
    .toBe(question1.answers.get(1));
    expect(wrapper.state('quiz').answeredQuestions.get(question2))
    .toBe(question2.answers.get(0));

  });

  const getQuestionCard = (index) => {
    return wrapper.find(QuestionCard).get(index);
  }
});
