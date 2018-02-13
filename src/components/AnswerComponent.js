import Answer from '../models/Answer';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';
import utils from '../utils';

import { LETTERS } from '../constants';

class AnswerComponent extends React.Component {
  render() {
    const { question, answer, scoreCalculation, level, isSelected } = this.props;
    const label = LETTERS[question.answers.indexOf(answer)];
    return (
      <div className="answer">
        <p className="selectable"  onClick={ () => this.recordAnswer() } >
          ({ label }) { answer.text }
        </p>
        {
          isSelected && answer.hasSubQuestions() &&
            <SubQuestionComponent
              subQuestions={ answer.subQuestions }
              subQuestionMode={ answer.subQuestionMode }
              level={ level }
              scoreCalculation={ scoreCalculation }
            />
        }
      </div>
    )
  }

  recordAnswer() {
    this.props.scoreCalculation.recordAnswer(
      this.props.question,
      this.props.answer
    );
    this.setState({ isSelected: true });
  }
}

AnswerComponent.defaultProps = {
  level: 0,
  isSelected: false,
};

AnswerComponent.propTypes = {
  answer: PropTypes.instanceOf(Answer).isRequired,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
  level: PropTypes.number,
  isSelected: PropTypes.bool,
};

export default AnswerComponent;
