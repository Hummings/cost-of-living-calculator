import Answer from '../../models/Answer';
import QuizComponent from '../QuizComponent';
import QuestionCard from '../QuestionCard';
import Immutable from 'immutable';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import React from 'react';
import Result from '../../models/Result';
import ResultCard from '../ResultCard';
import ScoreCalculation from '../../core/ScoreCalculation';
import ScoreRange from '../../models/ScoreRange';
import Summary from '../../models/Summary';

import { shallow } from 'enzyme';

jest.mock('../../core/ScoreCalculation');

describe('QuizComponent', () => {
  let quiz;
  let wrapper;
  let scoreCalculation;

  beforeEach(() => {
    scoreCalculation = new ScoreCalculation();
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
    wrapper = shallow(
      <QuizComponent
        quiz={ quiz }
        initialScoreCalculation={ scoreCalculation }
        alreadyStarted={ true }
      />
    );
  });

  it('renders a Get Started button if it has not been started', () => {
    wrapper = shallow(
      <QuizComponent
        quiz={ quiz }
        initialScoreCalculation={ scoreCalculation }
      />
    );

    expect(wrapper.find(QuestionCard).length).toBe(0);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('button').text()).toEqual('Get Started');

    wrapper.find('button').simulate('click');
    wrapper.update();

    expect(wrapper.find(QuestionCard).length).toBe(2);
    expect(wrapper.find('p.button.button-brand').length).toBe(0);
  });

  it('renders all the questions', () => {
    expect(wrapper.find(QuestionCard).length).toBe(2);
    const card1 = getQuestionCard(0);
    const card2 = getQuestionCard(1);

    expect(card1.props.question).toBe(quiz.questions.get(0));
    expect(card1.props.scoreCalculation).toBe(scoreCalculation);

    expect(card2.props.question).toBe(quiz.questions.get(1));
    expect(card2.props.scoreCalculation).toBe(scoreCalculation);

    expect(wrapper.find(ResultCard).length).toBe(0);

    expect(scoreCalculation.clearCallbacks).toHaveBeenCalled();
    expect(scoreCalculation.onChange).toHaveBeenCalledWith(expect.any(Function));
    quiz.questions.forEach(question => {
      expect(scoreCalculation.onQuestionCompleted).toHaveBeenCalledWith(question, expect.any(Function));
    });
  });

  it('indicates which question is active', () => {
    expect(getQuestionCard(0).props.isActive).toBe(true);
    expect(getQuestionCard(1).props.isActive).toBe(false);

    wrapper.instance().incrementActiveQuestionCard();
    wrapper.update();

    expect(getQuestionCard(0).props.isActive).toBe(false);
    expect(getQuestionCard(1).props.isActive).toBe(true);
  });

  it('increments active card via calculation onQuestionCompleted callback', () => {
    const getActiveProps = () => (
      [0, 1].map(i => wrapper.find(QuestionCard).get(i).props.isActive)
    );
    const onComplete = getQuestionCompletedCallback(
      quiz.questions.get(0)
    );

    expect(getActiveProps()).toEqual([true, false]);

    onComplete();
    wrapper.update();

    expect(getActiveProps()).toEqual([false, true]);
    expect(wrapper.find(ResultCard).length).toBe(0);
  });

  it('stores the new calculation on answer', () => {
    expect(getQuestionCard(0).props.scoreCalculation).toBe(scoreCalculation);
    expect(getQuestionCard(1).props.scoreCalculation).toBe(scoreCalculation);

    const onChange = scoreCalculation.onChange.mock.calls[0][0];
    expect(onChange).toBeInstanceOf(Function);

    const newCalculation = new ScoreCalculation();

    onChange(newCalculation);
    wrapper.update();

    expect(getQuestionCard(0).props.scoreCalculation).toBe(newCalculation);
    expect(getQuestionCard(1).props.scoreCalculation).toBe(newCalculation);

  });

  it('displays a result card when all the questions have been answered', () => {
    scoreCalculation.computeScore.mockReturnValue(5);
    const expectedResult = quiz.summary.getResultForScore(5);

    expect(wrapper.find(QuestionCard).length).toBe(2);
    expect(wrapper.find(ResultCard).length).toBe(0);

    let onComplete = getQuestionCompletedCallback(
      quiz.questions.get(0)
    );
    onComplete();
    wrapper.update();
    expect(wrapper.find(QuestionCard).length).toBe(2);
    expect(wrapper.find(ResultCard).length).toBe(0);

    onComplete = getQuestionCompletedCallback(
      quiz.questions.get(1)
    );
    onComplete();
    wrapper.update();
    expect(wrapper.find(QuestionCard).length).toBe(0);
    expect(wrapper.find(ResultCard).length).toBe(1);
    expect(wrapper.find(ResultCard).get(0).props.result).toBe(expectedResult);
  });

  const getQuestionCard = (index) => {
    return wrapper.find(QuestionCard).get(index);
  };

  const getQuestionCompletedCallback = (question) => {
    const call = scoreCalculation.onQuestionCompleted.mock.calls.find(
      call => call[0] === question
    );
    return call[1];
  };
});
