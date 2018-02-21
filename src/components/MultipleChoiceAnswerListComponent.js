import Answer from '../models/Answer';
import AnswerComponent from './AnswerComponent';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';


class MultipleChoiceAnswerListComponent extends React.Component {
  render() {
    const { question, scoreCalculation, level } = this.props;
    return (
      <ul className="answers">
      {question.answers.map(a => (
        <li key={a.getId()} className="answer active" >
          <input
            type="checkbox"
            checked={scoreCalculation.isSelected(a)}
          />
          <AnswerComponent
            answer={ a }
            question={ question }
            scoreCalculation={ scoreCalculation }
            level={ level }
          />
        </li>
      ))}
        <li className="answer active complete-question" onClick={this.completeQuestion.bind(this)}>
          <button className="button button-brand button-small" >
            Next
          </button>
        </li>
      </ul>
    );
  }

  selectAnswer(answer) {
    this.setState({ selectedAnswer: answer });
  }

  completeQuestion() {
    const { scoreCalculation, question } = this.props;
    scoreCalculation.completeMultipleChoiceQuestion(question);
  }
}

MultipleChoiceAnswerListComponent.defaultProps = {
  level: 0,
};

MultipleChoiceAnswerListComponent.propTypes = {
  level: PropTypes.number,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default MultipleChoiceAnswerListComponent;
