import React from 'react';
import Result from '../../models/Result';
import ResultCard from '../ResultCard';

import { shallow } from 'enzyme';

describe('ResultCard', () => {
  it('renders the result with required income formatted as money', () => {
    const result = new Result({
      requiredIncome: 100000,
    });
    const wrapper = shallow(<ResultCard result={result} />);
    expect(wrapper.text()).toContain('$100,000');
  });
});
