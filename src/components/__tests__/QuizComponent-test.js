import Answer from '../../models/Answer';
import QuizComponent from '../QuizComponent';
import QuestionCard from '../QuestionCard';
import Immutable from 'immutable';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import React from 'react';
import Result from '../../models/Result';
import ResultCard from '../ResultCard';
import ScoreRange from '../../models/ScoreRange';
import Summary from '../../models/Summary';


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
      summary: new Summary({
        results: Immutable.List.of(
          new Result({
            scoreRange: new ScoreRange({
              minScore: 0,
              maxScore: 2,
            }),
            requiredIncome: 100000,
          }),
          new Result({
            scoreRange: new ScoreRange({
              minScore: 3,
              maxScore: 7,
            }),
            requiredIncome: 550000,
          })
        ),
      }),
    });

    wrapper = shallow(<QuizComponent initialQuiz={ quiz } />);
  });

  it('renders all the questions', () => {
    expect(wrapper.find(QuestionCard).length).toBe(2);
    const card1 = getQuestionCard(0);
    const card2 = getQuestionCard(1);

    expect(card1.props.question).toBe(quiz.questions.get(0));
    expect(card2.props.question).toBe(quiz.questions.get(1));
    expect(wrapper.find(ResultCard).length).toBe(0);
  });

  it('indicates which question is active', () => {
    expect(getQuestionCard(0).props.isActive).toBe(true);
    expect(getQuestionCard(1).props.isActive).toBe(false);

    wrapper.setState({ activeQuestionCard: 1 });

    expect(getQuestionCard(0).props.isActive).toBe(false);
    expect(getQuestionCard(1).props.isActive).toBe(true);
  });

  it('increments active card on answer via onComplete prop function', () => {
    const getActiveProps = () => (
      [0, 1].map(i => wrapper.find(QuestionCard).get(i).props.isActive)
    );
    const onComplete = getQuestionCard(0).props.onComplete;

    expect(getActiveProps()).toEqual([true, false]);

    expect(onComplete).toBeInstanceOf(Function);

    onComplete();
    wrapper.update();

    expect(getActiveProps()).toEqual([false, true]);
  });

  it('displays a result card when all the questions have been answered', () => {
    expect(wrapper.find(QuestionCard).length).toBe(2);
    expect(wrapper.find(ResultCard).length).toBe(0);

    getQuestionCard(0).props.onComplete();
    wrapper.update();
    expect(wrapper.find(QuestionCard).length).toBe(2);
    expect(wrapper.find(ResultCard).length).toBe(0);

    getQuestionCard(1).props.onComplete();
    wrapper.update();
    expect(wrapper.find(QuestionCard).length).toBe(0);
    expect(wrapper.find(ResultCard).length).toBe(1);
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

    expect(wrapper.state('activeQuestionCard')).toBe(0);
  });

  const getQuestionCard = (index) => {
    return wrapper.find(QuestionCard).get(index);
  }
});
