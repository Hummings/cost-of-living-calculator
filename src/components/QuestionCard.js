import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Question from '../models/Question';
import React from 'react';

class QuestionCard extends React.Component {

  render() {
    return (
      <div className={ this.props.isActive ? 'active' : 'not-active' } >
        <QuestionComponent
          question={this.props.question}
          onAnswer={this.props.onAnswer}
          onComplete={this.props.onComplete}
          />
      </div>
    );
  }
}

QuestionCard.defaultProps = {
  isActive: true,
  onAnswer: (question, answer) => {},
  onComplete: () => {},
};

QuestionCard.propTypes = {
  question: PropTypes.instanceOf(Question).isRequired,
  isActive: PropTypes.bool,
  onAnswer: PropTypes.func, // args (question, answer)
  conComplete: PropTypes.func,
};

export default QuestionCard;
