import LoadingIndicator from '../LoadingIndicator';
import React from 'react';

import { shallow } from 'enzyme';


describe('LoadingIndicator', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LoadingIndicator />);
  });

  it('renders a loading indicator', () => {
    expect(wrapper.html()).toEqual('<div>Loading...</div>');
  });
});
