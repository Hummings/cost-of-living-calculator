import Card from './Card';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import QuestionComponent from './QuestionComponent';
import QuestionList from '../models/QuestionList';
import React from 'react';

import { callBoth } from '../utils';

class CardList extends React.Component {
  constructor() {
    super();
    this.state = {
      activeCard: 0,
      answers: new Immutable.Map(),
    };
  }

  render() {
    const { activeCard } = this.state;
    const { questionList } = this.props;
    const onAnswer = callBoth(
      this.storeAnswer.bind(this),
      this.incrementActiveCard.bind(this)
    );

    return (
      <div>
        {questionList.questions.map((q, i) => (
          <Card
            key={q.getId()}
            question={q}
            isActive={ i === activeCard }
            onAnswer={onAnswer}
            />
        ))}
      </div>
    );
  }

  storeAnswer(question, answer) {
    this.setState({ answers: this.state.answers.set(question, answer) });
  }

  incrementActiveCard() {
    this.setState({ activeCard: this.state.activeCard + 1 });
  }
}

CardList.propTypes = {
  questionList: PropTypes.instanceOf(QuestionList).isRequired,
}

export default CardList;
