import QuestionCard from './QuestionCard';
import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Quiz from '../models/Quiz';
import React from 'react';
import ResultCard from './ResultCard';
import ScoreCalculation from '../core/ScoreCalculation';


class QuizComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeQuestionCardIndex: 0,
      onResults: false,
      scoreCalculation: props.initialScoreCalculation,
    };
  }

  render() {
    const { quiz } = this.props;
    const { activeQuestionCardIndex, onResults } = this.state;

    const scoreCalculation = this.state.scoreCalculation
      .clearCallbacks()
      .onAnswer(newCalculation => {
        this.setState({ scoreCalculation: newCalculation });
      });

    if (onResults) {
      const score = scoreCalculation.computeScore()
      const result = quiz.summary.getResultForScore(score);
      return <ResultCard result={ result } />;
    } else {
      return (
        <div>
        {quiz.questions.map((q, i) => (
          <QuestionCard
            key={q.getId()}
            question={q}
            isActive={ i === activeQuestionCardIndex }
            scoreCalculation={
              scoreCalculation.onQuestionCompleted(
                q,
                this.incrementActiveQuestionCard.bind(this)
              )
            }
          />
        ))}
        </div>
      );
    }
  }

  incrementActiveQuestionCard() {
    const { quiz } = this.props;
    const { activeQuestionCardIndex } = this.state;
    const numQuestions = quiz.questions.size;
    const wasLastQuestion = activeQuestionCardIndex === (numQuestions - 1);
    if (wasLastQuestion) {
      this.setState({ onResults: true });
    } else {
      this.setState({ activeQuestionCardIndex: activeQuestionCardIndex + 1 });
    }
  }
}

QuizComponent.propTypes = {
  quiz: PropTypes.instanceOf(Quiz).isRequired,
  initialScoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
}

export default QuizComponent;
