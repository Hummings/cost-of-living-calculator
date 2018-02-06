import QuestionCard from './QuestionCard';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Quiz from '../models/Quiz';
import React from 'react';

import { callBoth } from '../utils';

class QuizComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      activeQuestionCard: 0,
      answers: new Immutable.Map(),
    };
  }

  render() {
    const { activeQuestionCard } = this.state;
    const { quiz } = this.props;
    const onAnswer = callBoth(
      this.storeAnswer.bind(this),
      this.incrementActiveQuestionCard.bind(this)
    );

    return (
      <div>
        {quiz.questions.map((q, i) => (
          <QuestionCard
            key={q.getId()}
            question={q}
            isActive={ i === activeQuestionCard }
            onAnswer={onAnswer}
            />
        ))}
      </div>
    );
  }

  storeAnswer(question, answer) {
    this.setState({ answers: this.state.answers.set(question, answer) });
  }

  incrementActiveQuestionCard() {
    this.setState({ activeQuestionCard: this.state.activeQuestionCard + 1 });
  }
}

QuizComponent.propTypes = {
  quiz: PropTypes.instanceOf(Quiz).isRequired,
}

export default QuizComponent;
