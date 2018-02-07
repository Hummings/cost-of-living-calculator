import QuestionCard from './QuestionCard';
import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Quiz from '../models/Quiz';
import React from 'react';
import ResultCard from './ResultCard';


class QuizComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeQuestionCard: 0,
      quiz: props.initialQuiz,
      onResults: false,
    };
  }

  render() {
    const { activeQuestionCard, quiz, onResults } = this.state;
    if (onResults) {
      return <ResultCard result={ quiz.getResult() } />;
    } else {
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
  }

  storeAnswer(question, answer) {
    this.setState({ quiz: this.state.quiz.withAnswerSelected(question, answer) });
  }

  incrementActiveQuestionCard() {
    const { activeQuestionCard, quiz } = this.state;
    const numQuestions = quiz.questions.size;
    const wasLastQuestion = activeQuestionCard === (numQuestions - 1);
    if (wasLastQuestion) {
      this.setState({ onResults: true });
    } else {
      this.setState({ activeQuestionCard: this.state.activeQuestionCard + 1 });
    }
  }
}

QuizComponent.propTypes = {
  initialQuiz: PropTypes.instanceOf(Quiz).isRequired,
}

export default QuizComponent;
