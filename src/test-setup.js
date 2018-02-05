import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

export const afterAllPromises = fn => {
  setTimeout(fn, 1);
};
