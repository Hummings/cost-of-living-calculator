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
      <div>
        <p>(Select all that apply)</p>
        <ul className="answers">
        {question.answers.map(a => (
          <li key={a.getId()} className="answer active" >
            <AnswerComponent
              answer={ a }
              label={
                <input
                  type="checkbox"
                  checked={scoreCalculation.isSelected(question, a)}
                ></input>
              }
              level={ level }
              selectAnswer={ this.selectAnswer.bind(this, a) }
              scoreCalculation={ scoreCalculation }
            />
          </li>
        ))}
          <li className="answer active complete-question" onClick={this.completeQuestion.bind(this)}>
            <button className="button button-brand button-small" >
              Next
            </button>
          </li>
        </ul>
      </div>
    );
  }

  selectAnswer(answer) {
    const { question, scoreCalculation } = this.props;
    if (scoreCalculation.isSelected(question, answer)) {
      scoreCalculation.deleteAnswer(question, answer);
    } else {
      scoreCalculation.recordAnswer(question, answer);
    }
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
