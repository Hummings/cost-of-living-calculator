import Answer from '../models/Answer';
import AnswerComponent from './AnswerComponent';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';

import { LETTERS } from '../constants';

class AnswerListComponent extends React.Component {
  render() {
    const { question, scoreCalculation, level } = this.props;
    return (
      <ul className="answers">
      {question.answers.map(a => (
        <li key={a.getId()} className="answer">
          <AnswerComponent
            answer={ a }
            question={ question }
            scoreCalculation={ scoreCalculation }
            level={ level }
          />
        </li>
      ))}
      </ul>
    );
  }
}

AnswerListComponent.defaultProps = {
  level: 0,
};

AnswerListComponent.propTypes = {
  level: PropTypes.number,
  question: PropTypes.instanceOf(Question).isRequired,
};

export default AnswerListComponent;


