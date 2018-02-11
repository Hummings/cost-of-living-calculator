import SubQuestionModes from '../SubQuestionModes';

describe('SubQuestionModes', () => {
  describe('deserialize', () => {
    it('returns ANSWER_ALL by default', () => {
      expect(SubQuestionModes.deserialize(undefined)).toBe(SubQuestionModes.ANSWER_ALL);
      expect(SubQuestionModes.deserialize(null)).toBe(SubQuestionModes.ANSWER_ALL);
      expect(SubQuestionModes.deserialize('')).toBe(SubQuestionModes.ANSWER_ALL);
    });

    it('desrializes the string', () => {
      expect(SubQuestionModes.deserialize('ANSWER_ALL')).toBe(SubQuestionModes.ANSWER_ALL);
      expect(SubQuestionModes.deserialize('ANSWER_ONE')).toBe(SubQuestionModes.ANSWER_ONE);
    });

    it('raises on invalid string', () => {
      expect(() => SubQuestionModes.deserialize('wtf')).toThrow();
    });
  });
});
