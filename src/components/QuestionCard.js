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
          onAnswer={ this.props.onAnswer}
          />
      </div>
    );
  }
}

QuestionCard.defaultProps = {
  isActive: true,
  onAnswer: () => {},
};

QuestionCard.propTypes = {
  question: PropTypes.instanceOf(Question).isRequired,
  isActive: PropTypes.bool,
  onAnswer: PropTypes.func, // args (question, answer)
};

export default QuestionCard;
