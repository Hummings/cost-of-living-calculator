import PropTypes from 'prop-types';
import React from 'react';
import Result from '../models/Result';


class ResultCard extends React.Component {
  render() {
    const { result } = this.props;
    return (
      <section className="box special">
        <h4>You need to earn ${ result.requiredIncome.toLocaleString('en') } to support your lifestyle</h4>
      </section>
    );
  }
}

ResultCard.propTypes = {
  result: PropTypes.instanceOf(Result).isRequired,
};

export default ResultCard;
