import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import QuestionComponent from './QuestionComponent';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionListComponent from './SubQuestionListComponent';
import SubQuestionChoiceComponent from './SubQuestionChoiceComponent';


class SubQuestionComponent extends React.Component {

  render() {
    const { level, subQuestions, scoreCalculation, subQuestionMode } = this.props;
    switch(subQuestionMode) {
      case Question.SubQuestionModes.ANSWER_ALL:
        return (
          <SubQuestionListComponent
            subQuestions={ subQuestions }
            scoreCalculation={ scoreCalculation }
            level={ level + 1 }
          />
        );
      case Question.SubQuestionModes.ANSWER_ONE:
        return (
           <SubQuestionChoiceComponent
            subQuestions={ subQuestions }
            scoreCalculation={ scoreCalculation }
            level={ level + 1 }
          />
        );
      default:
        throw new Error('Unrecognized subquestion mode ' + subQuestionMode);
    }
  }
};

SubQuestionComponent.defaultProps = {
  level: 1,
};

SubQuestionComponent.propTypes = {
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
  subQuestions: ImmutablePropTypes.listOf(Question).isRequired,
  level: PropTypes.number,
  subQuestionMode: PropTypes.oneOf(Object.values(Question.SubQuestionModes)),
}

export default SubQuestionComponent;
