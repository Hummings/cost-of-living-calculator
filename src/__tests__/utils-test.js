import { dasherize } from '../utils';

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
});
