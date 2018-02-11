import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import QuestionComponent from './QuestionComponent';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';

import { ROMAN_NUMERALS } from '../constants';


class SubQuestionChoiceComponent extends React.Component {

  render() {
    const { level, subQuestions, scoreCalculation } = this.props;

    if (!subQuestions.isEmpty()) {
      return (
        <ul className="subQuestions">
        {subQuestions.map((q, i) => (
          <li key={q.getId()} className="subQuestion active one-of-many">
            <QuestionComponent
              question={q}
              label={ROMAN_NUMERALS[i]}
              level={level}
              scoreCalculation={scoreCalculation}
            />
          </li>
        ))}
        </ul>
      );
    } else {
      return '';
    }
  }
};

SubQuestionChoiceComponent.defaultProps = {
  level: 1,
};

SubQuestionChoiceComponent.propTypes = {
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
  subQuestions: ImmutablePropTypes.listOf(Question).isRequired,
  level: PropTypes.number,
}

export default SubQuestionChoiceComponent;
