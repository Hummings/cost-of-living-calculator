import AnswerListComponent from './AnswerListComponent';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionComponent from './SubQuestionComponent';


import utils from '../utils';

class QuestionComponent extends React.Component {
  render() {
    const { question, label, level, scoreCalculation } = this.props;
    return (
      <div className={'level' + level}>
        <h3>{ label && `(${label}) ` }{ question.title }</h3>
        {
          question.hasSubQuestions() &&
          <SubQuestionComponent
            subQuestions={ question.subQuestions }
            scoreCalculation={ scoreCalculation }
            subQuestionMode={ question.subQuestionMode }
            level={ level }
          />
        }
        {
          question.hasAnswers() &&
          <AnswerListComponent
            question={ question }
            scoreCalculation={ scoreCalculation }
            level={ level }
          />
        }
      </div>
    );
  }
}

QuestionComponent.defaultProps = {
  label: '',
  level: 0,
};

QuestionComponent.propTypes = {
  label: PropTypes.string,
  level: PropTypes.number,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default QuestionComponent;
