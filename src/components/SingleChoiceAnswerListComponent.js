import Answer from '../models/Answer';
import AnswerComponent from './AnswerComponent';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';

import { LETTERS } from '../constants';

class SingleChoiceAnswerListComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedAnswer: null,
    };
  }

  render() {
    const { question, scoreCalculation, level } = this.props;
    const { selectedAnswer } = this.state;
    return (
      <ul className="answers">
      {question.answers.map(a => (
        <li
          key={a.getId()}
          className={'answer ' + (this.isInactive(a) ? 'not-active' : 'active')}
          onClick={this.selectAnswer.bind(this, a)}
        >
          <AnswerComponent
            answer={ a }
            question={ question }
            scoreCalculation={ scoreCalculation }
            level={ level }
            isSelected={ a === selectedAnswer }
          />
        </li>
      ))}
      </ul>
    );
  }

  selectAnswer(answer) {
    this.setState({ selectedAnswer: answer });
  }

  isInactive(answer) {
    const { selectedAnswer } = this.state;
    return !!(selectedAnswer && (selectedAnswer !== answer));
  }
}

SingleChoiceAnswerListComponent.defaultProps = {
  level: 0,
};

SingleChoiceAnswerListComponent.propTypes = {
  level: PropTypes.number,
  question: PropTypes.instanceOf(Question).isRequired,
};

export default SingleChoiceAnswerListComponent;


