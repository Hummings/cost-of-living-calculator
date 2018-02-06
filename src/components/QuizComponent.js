import QuestionCard from './QuestionCard';
import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Quiz from '../models/Quiz';
import React from 'react';


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

    return (
      <div>
        {quiz.questions.map((q, i) => (
          <QuestionCard
            key={q.getId()}
            question={q}
            isActive={ i === activeQuestionCard }
            onAnswer={this.storeAnswer.bind(this)}
            onComplete={this.incrementActiveQuestionCard.bind(this)}
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
