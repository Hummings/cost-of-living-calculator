import { dasherize, callBoth } from '../utils';

describe('utils', () => {
  describe('dasherize', () => {
    it('dasherizes the input string', () => {
      expect(dasherize()).toEqual('');
      expect(dasherize('HelloWorld')).toEqual('hello-world');
      expect(dasherize('hello world')).toEqual('hello-world');
      expect(dasherize('what\'s the best food?')).toEqual('whats-the-best-food');
      expect(dasherize('multiple   spaces')).toEqual('multiple-spaces');
    });
  });

  describe('callBoth', () => {
    it('calls both the functions with the original arguments', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      const both = callBoth(fn1, fn2);

      both(1, 2, 3);

      expect(fn1).toHaveBeenCalledWith(1, 2, 3);
      expect(fn2).toHaveBeenCalledWith(1, 2, 3);
    });
  });
});
