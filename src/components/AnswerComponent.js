import Answer from '../models/Answer';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';

import { LETTERS } from '../constants';

class AnswerComponent extends React.Component {
  render() {
    const { question, answer, scoreCalculation } = this.props;
    const label = LETTERS[question.answers.indexOf(answer)];
    return (
      <p onClick={ () => this.recordAnswer() }>({ label }) { answer.text }</p>
    )
  }

  recordAnswer() {
    this.props.scoreCalculation.recordAnswer(
      this.props.question,
      this.props.answer
    );
  }
}

AnswerComponent.propTypes = {
  answer: PropTypes.instanceOf(Answer).isRequired,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default AnswerComponent;
