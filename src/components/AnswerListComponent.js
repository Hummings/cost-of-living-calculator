import Answer from '../models/Answer';
import AnswerComponent from './AnswerComponent';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SingleChoiceAnswerListComponent from './SingleChoiceAnswerListComponent';
import MultipleChoiceAnswerListComponent from './MultipleChoiceAnswerListComponent';

import { LETTERS } from '../constants';

class AnswerListComponent extends React.Component {
  render() {
    const { question, scoreCalculation, level } = this.props;
    if (question.isMultipleChoice) {
      return (
        <MultipleChoiceAnswerListComponent
          question={question}
          scoreCalculation={scoreCalculation}
          level={level}
        />
      );
    } else {
      return (
        <SingleChoiceAnswerListComponent
          question={question}
          scoreCalculation={scoreCalculation}
          level={level}
        />
      );
    }
  }
}

AnswerListComponent.defaultProps = {
  level: 0,
};

AnswerListComponent.propTypes = {
  level: PropTypes.number,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default AnswerListComponent;


