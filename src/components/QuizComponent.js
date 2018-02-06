import QuestionCard from './QuestionCard';
import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Quiz from '../models/Quiz';
import React from 'react';

import { callBoth } from '../utils';

class QuizComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeQuestionCard: 0,
      quiz: props.initialQuiz,
    };
  }

  render() {
    const { activeQuestionCard, quiz } = this.state;
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
    this.setState({ quiz: this.state.quiz.withAnswerSelected(question, answer) });
  }

  incrementActiveQuestionCard() {
    this.setState({ activeQuestionCard: this.state.activeQuestionCard + 1 });
  }
}

QuizComponent.propTypes = {
  initialQuiz: PropTypes.instanceOf(Quiz).isRequired,
}

export default QuizComponent;
