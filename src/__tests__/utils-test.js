import utils from '../utils';

describe('utils', () => {
  describe('dasherize', () => {
    it('dasherizes the input string', () => {
      expect(utils.dasherize()).toEqual('');
      expect(utils.dasherize('HelloWorld')).toEqual('hello-world');
      expect(utils.dasherize('hello world')).toEqual('hello-world');
      expect(utils.dasherize('what\'s the best food?')).toEqual('whats-the-best-food');
      expect(utils.dasherize('multiple   spaces')).toEqual('multiple-spaces');
    });
  });

  describe('combine', () => {
    it('calls all the functions with the original arguments', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const fn3 = jest.fn();

      const combined = utils.combine(fn1, fn2, fn3);

      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
      expect(fn3).not.toHaveBeenCalled();

      combined(1, 2);

      expect(fn1).toHaveBeenCalledWith(1, 2);
      expect(fn2).toHaveBeenCalledWith(1, 2);
      expect(fn3).toHaveBeenCalledWith(1, 2);
    });

    it('can be nested', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const fn3 = jest.fn();

      const combined = utils.combine(fn1, utils.combine(fn2, fn3));
      combined();

      combined(1, 2);

      expect(fn1).toHaveBeenCalledWith(1, 2);
      expect(fn2).toHaveBeenCalledWith(1, 2);
      expect(fn3).toHaveBeenCalledWith(1, 2);
    });
  });
});
