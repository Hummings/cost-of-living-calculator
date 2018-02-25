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
      isStarted: props.alreadyStarted,
      scoreCalculation: props.initialScoreCalculation,
    };
  }

  render() {
    const { quiz } = this.props;
    const { activeQuestionCardIndex, onResults, isStarted } = this.state;

    if (!isStarted) {
      return this.renderGetStarted();
    }

    const scoreCalculation = this.state.scoreCalculation
      .clearCallbacks()
      .onChange(newCalculation => {
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

  renderGetStarted() {
    return (
      <section className="box special">
        <h3>Hummings Cost of Living Calculator</h3>
        <button
          onClick={ () => this.setState({ isStarted: true }) }
          className="button button-brand get-started"
        >
          Get Started
        </button>
      </section>
    );
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

QuizComponent.defaultProps = {
  alreadyStarted: false,
};

QuizComponent.propTypes = {
  alreadyStarted: PropTypes.bool,
  quiz: PropTypes.instanceOf(Quiz).isRequired,
  initialScoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default QuizComponent;
