import Answer from '../models/Answer';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';

import { LETTERS } from '../constants';

class AnswerComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      isSelected: false,
    };
  }

  render() {
    const { question, answer, scoreCalculation, level } = this.props;
    const label = LETTERS[question.answers.indexOf(answer)];
    return (
      <div className="answer">
        <p className="selectable"  onClick={ () => this.recordAnswer() } >
          ({ label }) { answer.text }
        </p>
        {
          this.shouldRenderSubQuestions() &&
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

  shouldRenderSubQuestions() {
    return this.state.isSelected && this.props.answer.hasSubQuestions();
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
};

AnswerComponent.propTypes = {
  answer: PropTypes.instanceOf(Answer).isRequired,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
  level: PropTypes.number,
};

export default AnswerComponent;
