import PropTypes from 'prop-types';
import React from 'react'

import { fetchQuestions } from './api';
import QuizComponent from './components/QuizComponent';
import LoadingIndicator from './components/LoadingIndicator';
import ScoreCalculation from './core/ScoreCalculation';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      quiz: null,
    };
  }

  componentWillMount() {
    this.props.fetchQuestions().then(quiz => {
      this.setState({ quiz: quiz });;
    });
  }

  render() {
    const { quiz } = this.state;
    if (quiz) {
      return <QuizComponent quiz={ quiz } initialScoreCalculation={ new ScoreCalculation(quiz) } />;
    } else {
      return <LoadingIndicator />;
    }
  }
}

App.defaultProps = {
  fetchQuestions: fetchQuestions,
};

App.PropTypes = {
  fetchQuestions: PropTypes.func,
};


export default App;
