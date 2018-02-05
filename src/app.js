import PropTypes from 'prop-types';
import React from 'react'

import { fetchQuestions } from './api';
import CardList from './components/CardList';
import LoadingIndicator from './components/LoadingIndicator';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      questionList: null,
    };
  }

  componentWillMount() {
    this.props.fetchQuestions().then(questionList => {
      this.setState({ questionList: questionList });;
    });
  }

  render() {
    if (this.state.questionList) {
      return <CardList questionList={ this.state.questionList } />;
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
