class MockScoreCalculation {
  constructor() {
    this.onChange = jest.fn().mockReturnValue(this),
    this.onQuestionCompleted = jest.fn().mockReturnValue(this);
    this.recordAnswer = jest.fn().mockReturnValue(this);
    this.deleteAnswer = jest.fn().mockReturnValue(this);
    this.clearCallbacks = jest.fn().mockReturnValue(this);
    this.hasAnswer = jest.fn().mockReturnValue(false);
    this.computeScore = jest.fn().mockReturnValue(0);
    this.isSelected = jest.fn().mockReturnValue(false);
    this.completeMultipleChoiceQuestion = jest.fn();
  }

}

export default MockScoreCalculation;
