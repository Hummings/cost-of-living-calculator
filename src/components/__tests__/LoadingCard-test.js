import LoadingCard from '../LoadingCard';
import React from 'react';

import { shallow } from 'enzyme';


describe('LoadingCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LoadingCard />);
  });

  it('renders a loading indicator', () => {
    expect(wrapper.text()).toEqual('Loading...');
  });
});
