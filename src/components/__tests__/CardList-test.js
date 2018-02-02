import Answer from '../../models/Answer';
import CardList from '../CardList';
import Card from '../Card';
import Immutable from 'immutable';
import Question from '../../models/Question';
import QuestionList from '../../models/QuestionList';
import React from 'react';

import { shallow } from 'enzyme';

describe('CardList', () => {
  let questionList;
  let wrapper;

  beforeEach(() => {
    questionList = new QuestionList({
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

    wrapper = shallow(<CardList questionList={ questionList } />);
  });

  it('renders all the questions', () => {
    expect(wrapper.find(Card).length).toBe(2);
    const card1 = getCard(0);
    const card2 = getCard(1);

    expect(card1.props.question).toBe(questionList.questions.get(0));
    expect(card2.props.question).toBe(questionList.questions.get(1));
  });

  it('indicates which question is active', () => {
    expect(getCard(0).props.isActive).toBe(true);
    expect(getCard(1).props.isActive).toBe(false);

    wrapper.setState({ activeCard: 1 });

    expect(getCard(0).props.isActive).toBe(false);
    expect(getCard(1).props.isActive).toBe(true);
  });

  it('increments active card on answer via prop function', () => {
    const onAnswer = getCard(0).props.onAnswer
    expect(wrapper.state('activeCard')).toBe(0);

    expect(onAnswer).toBeInstanceOf(Function);

    onAnswer(
      questionList.questions.get(0),
      questionList.questions.get(0).answers.get(0)
    );

    expect(wrapper.state('activeCard')).toBe(1);
  });

  it('keeps track of the selected answers via prop function', () => {
    const onAnswer1 = getCard(0).props.onAnswer
    const onAnswer2 = getCard(1).props.onAnswer
    const question1 = questionList.questions.get(0)
    const question2 = questionList.questions.get(1)
    expect(onAnswer1).toBeInstanceOf(Function);
    expect(onAnswer2).toBeInstanceOf(Function);

    onAnswer1(question1, question1.answers.get(1));
    onAnswer2(question2, question2.answers.get(0));

    expect(wrapper.state('answers').get(question1))
    .toBe(question1.answers.get(1));
    expect(wrapper.state('answers').get(question2))
    .toBe(question2.answers.get(0));

  });

  const getCard = (index) => {
    return wrapper.find(Card).get(index);
  }
});
