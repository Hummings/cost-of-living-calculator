class MockScoreCalculation {
  constructor() {
    this.onAnswer = jest.fn().mockReturnValue(this),
    this.onQuestionCompleted = jest.fn().mockReturnValue(this);
    this.recordAnswer = jest.fn().mockReturnValue(this);
    this.clearCallbacks = jest.fn().mockReturnValue(this);
    this.computeScore = jest.fn().mockReturnValue(0);
  }

}

export default MockScoreCalculation;
