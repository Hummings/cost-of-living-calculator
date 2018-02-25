import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import Question from '../models/Question';
import React from 'react';
import ScoreCalculation from '../core/ScoreCalculation';

class QuestionCard extends React.Component {

  render() {
    return (
      <section className={'box special ' + (this.props.isActive ? 'active' : 'not-active') } >
        <QuestionComponent
          question={this.props.question}
          scoreCalculation={this.props.scoreCalculation}
          />
      </section>
    );
  }
}

QuestionCard.defaultProps = {
  isActive: true,
  onComplete: () => {},
};

QuestionCard.propTypes = {
  isActive: PropTypes.bool,
  question: PropTypes.instanceOf(Question).isRequired,
  scoreCalculation: PropTypes.instanceOf(ScoreCalculation).isRequired,
};

export default QuestionCard;
