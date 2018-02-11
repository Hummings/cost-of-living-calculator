import AnswerComponent from './AnswerComponent';
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
        <h4>{ label && `(${label}) ` }{ question.title }</h4>
        {
          question.hasSubQuestions() &&
          <SubQuestionComponent
            subQuestions={ question.subQuestions }
            scoreCalculation={ scoreCalculation }
            subQuestionMode={ question.subQuestionMode }
            level={ level }
          />
        }
        { this.renderAnswers() }
      </div>
    );
  }

  renderAnswers() {
    const { question, scoreCalculation, level } = this.props;
    const answers = question.answers;

    if (!answers.isEmpty()) {
      return (
        <ul className="answers">
        {answers.map(a => (
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
    } else {
      return '';
    }
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
