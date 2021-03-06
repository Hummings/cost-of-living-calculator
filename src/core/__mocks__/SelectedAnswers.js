class MockSelectedAnswers {
  constructor() {
    this.recordAnswer = jest.fn().mockReturnValue(this);
    this.recordCompletedQuestion = jest.fn().mockReturnValue(this);
    this.deleteAnswer = jest.fn().mockReturnValue(this);
    this.computeQuestionScore = jest.fn().mockReturnValue(0);
    this.hasAnswer = jest.fn().mockReturnValue(false);
    this.isSelected = jest.fn().mockReturnValue(false);
    this.isCompleted = jest.fn().mockReturnValue(false);
  }

}

export default MockSelectedAnswers;
