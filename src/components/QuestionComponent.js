import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionChoiceComponent from './SubQuestionChoiceComponent';
import SubQuestionListComponent from './SubQuestionListComponent';


import utils from '../utils';
import { LETTERS, ROMAN_NUMERALS } from '../constants';

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
    const answers = this.props.question.get('answers');
    if (!answers.isEmpty()) {
      return (
        <ul className="answers">
        {answers.map((a, i) => (
          <li
            key={a.getId()}
            className="answer"
            onClick={ this.selectAnswer.bind(this, a) }
          >({ LETTERS[i] }) { a.text }</li>
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

  selectAnswer(answer) {
    this.props.scoreCalculation.recordAnswer(
      this.props.question,
      answer
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
