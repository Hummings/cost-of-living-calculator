import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import QuestionComponent from './QuestionComponent';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';

import { ROMAN_NUMERALS } from '../constants';


class SubQuestionListComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      activeSubQuestionIndex: 0,
    };
  }

  render() {
    const { level, subQuestions } = this.props;
    const scoreCalculation = this.props.scoreCalculation.onAnswer(() => {
      this.incrementActiveSubQuestion();
    });
    return (
      <ul className="subQuestions">
      {subQuestions.map((q, i) => (
        <li
          key={q.getId()}
          className={ 'subQuestion ' + (this.isActiveSubQuestion(i) ? 'active' : 'not-active') }
        >
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
  }

  isActiveSubQuestion(index) {
    return this.state.activeSubQuestionIndex === index;
  }

  incrementActiveSubQuestion() {
    const { activeSubQuestionIndex } = this.state;
    this.setState({ activeSubQuestionIndex: activeSubQuestionIndex + 1 });
  }
};

SubQuestionListComponent.defaultProps = {
  level: 1,
};

SubQuestionListComponent.propTypes = {
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
  subQuestions: ImmutablePropTypes.listOf(Question).isRequired,
  level: PropTypes.number,
}

export default SubQuestionListComponent;
