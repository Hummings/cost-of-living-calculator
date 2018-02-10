import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';
import SubQuestionListComponent from './SubQuestionListComponent';


import utils from '../utils';
import { LETTERS, ROMAN_NUMERALS } from '../constants';

class QuestionComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedAnswer: null,
    };
  }

  render() {
    const { question, label, level, scoreCalculation } = this.props;
    return (
      <div className={'level' + level}>
        <h4>{ label && `(${label}) ` }{ this.props.question.title }</h4>
        {
          question.hasSubQuestions() &&
            <SubQuestionListComponent
              subQuestions={ question.subQuestions }
              scoreCalculation={ scoreCalculation }
              level={ level + 1 }
            />
        }
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
            className={ 'answer ' + (this.isDisabled(a) ? 'disabled' : 'enabled') }
            onClick={ this.selectAnswer.bind(this, a) }
          >({ LETTERS[i] }) { a.text }</li>
        ))}
        </ul>
      );
    } else {
      return '';
    }
  }

  selectAnswer(answer) {
    this.setState({ selectedAnswer: answer });
    this.props.scoreCalculation.recordAnswer(
      this.props.question,
      answer
    );
  }

  isDisabled(answer) {
    const { selectedAnswer } = this.state;
    return selectedAnswer && selectedAnswer !== answer;
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
