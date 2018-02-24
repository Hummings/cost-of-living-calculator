import Answer from '../models/Answer';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';


class AnswerComponent extends React.Component {
  render() {
    const {  answer, label, level, isSelected } = this.props;
    return (
      <div className="answer">
        <p className="selectable"  onClick={ this.props.selectAnswer } >
          { label } { answer.text }
        </p>
        {
          isSelected && answer.hasSubQuestions() &&
            <SubQuestionComponent
              subQuestions={ answer.subQuestions }
              subQuestionMode={ answer.subQuestionMode }
              level={ level }
              scoreCalculation={ this.props.scoreCalculation }
            />
        }
      </div>
    )
  }
}

AnswerComponent.defaultProps = {
  label: '',
  level: 0,
  isSelected: false,
  selectAnswer: () => {},
};

AnswerComponent.propTypes = {
  isSelected: PropTypes.bool,
  answer: PropTypes.instanceOf(Answer).isRequired,
  level: PropTypes.number,
  selectAnswer: PropTypes.func,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default AnswerComponent;
