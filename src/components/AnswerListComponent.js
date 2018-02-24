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
      {question.answers.map((a, i) => (
        <li
          key={a.getId()}
          className={'answer ' + (this.isInactive(a) ? 'not-active' : 'active')}
        >
          <AnswerComponent
            answer={ a }
            label={ `(${LETTERS[i]})`}
            level={ level }
            isSelected={ scoreCalculation.isSelected(question, a) }
            selectAnswer={ () => scoreCalculation.recordAnswer(question, a) }
            scoreCalculation={ scoreCalculation }
          />
        </li>
      ))}
      </ul>
    );
  }

  isInactive(answer) {
    const { scoreCalculation, question } = this.props;
    return scoreCalculation.hasAnswer(question) && !scoreCalculation.isSelected(question, answer);
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


