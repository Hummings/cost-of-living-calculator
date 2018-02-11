import AnswerComponent from './AnswerComponent';
import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionChoiceComponent from './SubQuestionChoiceComponent';
import SubQuestionListComponent from './SubQuestionListComponent';


import utils from '../utils';

class QuestionComponent extends React.Component {
  render() {
    const { question, label, level, scoreCalculation } = this.props;
    return (
      <div className={'level' + level}>
        <h4>{ label && `(${label}) ` }{ question.title }</h4>
        { this.renderSubQuestions() }
        { this.renderAnswers() }
      </div>
    );
  }

  renderAnswers() {
    const { question, scoreCalculation } = this.props;
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
            />
          </li>
        ))}
        </ul>
      );
    } else {
      return '';
    }
  }

  renderSubQuestions() {
    const { question, level, scoreCalculation } = this.props;
    if (question.hasSubQuestions() && question.subQuestionMode === Question.SubQuestionModes.ANSWER_ALL) {
      return (
        <SubQuestionListComponent
          subQuestions={ question.subQuestions }
          scoreCalculation={ scoreCalculation }
          level={ level + 1 }
        />
      );
    } else if (question.hasSubQuestions() && question.subQuestionMode === Question.SubQuestionModes.ANSWER_ONE) {
      return (
        <SubQuestionChoiceComponent
          subQuestions={ question.subQuestions }
          scoreCalculation={ scoreCalculation }
          level={ level + 1 }
        />
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
