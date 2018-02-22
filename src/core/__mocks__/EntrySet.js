class MockEntrySet {
  constructor() {
    this.recordAnswer = jest.fn().mockReturnValue(this);
    this.recordCompletedQuestion = jest.fn().mockReturnValue(this);
    this.computeQuestionScore = jest.fn().mockReturnValue(0);
    this.isCompleted = jest.fn().mockReturnValue(false);
  }

}

export default MockEntrySet;
