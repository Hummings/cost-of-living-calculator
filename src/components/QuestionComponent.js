import PropTypes from 'prop-types';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';


import utils from '../utils';
import { LETTERS, ROMAN_NUMERALS } from '../constants';

class QuestionComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedAnswer: null,
      activeSubQuestion: 0,
    };
  }

  render() {
    const { question, label, level } = this.props;
    return (
      <div className={'level' + level}>
        <h4>{ label && `(${label}) ` }{ this.props.question.title }</h4>
        { this.renderSubQuestions() }
        { this.renderAnswers() }
      </div>
    );
  }

  renderSubQuestions() {
    const level = this.props.level + 1;
    const subQuestions = this.props.question.get('subQuestions');
    const scoreCalculation = this.props.scoreCalculation.onQuestionCompleted(() => {
      this.incrementActiveSubQuestion();
    });

    if (!subQuestions.isEmpty()) {
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
    } else {
      return '';
    }
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

  isActiveSubQuestion(index) {
    return this.state.activeSubQuestion === index;
  }

  incrementActiveSubQuestion() {
    const { activeSubQuestion } = this.state;
    this.setState({ activeSubQuestion: activeSubQuestion + 1 });
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
