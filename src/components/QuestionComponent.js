import PropTypes from 'prop-types';
import React from 'react';
import Question from '../models/Question';

import { ROMAN_NUMERALS } from '../constants';

class QuestionComponent extends React.Component {

  constructor() {
    super();
    this.state = { selectedAnswer: null };
  }

  render() {
    const { question } = this.props;
    return (
      <div>
        <h4>{ this.props.question.title }</h4>
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
          >({ ROMAN_NUMERALS[i] }) { a.text }</li>
        ))}
        </ul>
      );
    } else {
      return '';
    }
  }

  selectAnswer(answer) {
    this.setState({ selectedAnswer: answer });
  }

  isDisabled(answer) {
    const { selectedAnswer } = this.state;
    return selectedAnswer && selectedAnswer !== answer;
  }
}

QuestionComponent.propTypes = {
  question: PropTypes.instanceOf(Question),
};

export default QuestionComponent;
