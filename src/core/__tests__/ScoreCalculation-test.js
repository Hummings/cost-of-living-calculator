import Answer from '../../models/Answer';
import SelectedAnswers from '../SelectedAnswers';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import ScoreCalculation from '../ScoreCalculation';
import SubQuestionModes from '../../models/SubQuestionModes';

import { List } from 'immutable';

jest.mock('../SelectedAnswers');

describe('ScoreCalculation', () => {
  let selectedAnswers;

  const makeCalculation = (...questions) => new ScoreCalculation(new Quiz({
    questions: List(questions),
  }), {
    selectedAnswers: selectedAnswers,
  });

  beforeEach(() => {
    selectedAnswers = new SelectedAnswers();
  });

  describe('onChange', () => {
    it('calls the callback when a question is answered', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const callback = jest.fn();
      let calculation = makeCalculation(q)
        .onChange(callback);

      expect(callback).not.toHaveBeenCalled();

      calculation = calculation.recordAnswer(q, q.answers.get(0));
      expect(callback).toHaveBeenCalledWith(calculation);
    });

    it('chains callbacks', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      makeCalculation(q)
        .onChange(callback1)
        .onChange(callback2)
        .recordAnswer(q, q.answers.get(0));

      expect(callback1).toHaveBeenCalledWith(expect.any(ScoreCalculation));
      expect(callback2).toHaveBeenCalledWith(expect.any(ScoreCalculation));
    });
  });

  describe('onQuestionCompleted', () => {
    it('calls the callback for newly completed questions', () => {
      const callback = jest.fn();
       const q = new Question({
        title: 'q1',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });

      selectedAnswers.isCompleted.mockReturnValue(false);
      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      selectedAnswers.isCompleted.mockReturnValue(true);
      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(0));
      expect(callback).not.toHaveBeenCalled();

      const newSelectedAnswers = new SelectedAnswers();
      newSelectedAnswers.isCompleted.mockReturnValue(true);
      selectedAnswers.recordAnswer.mockReturnValue(newSelectedAnswers);
      selectedAnswers.isCompleted.mockReturnValue(false);

      makeCalculation(q)
        .onQuestionCompleted(q, callback)
        .recordAnswer(q, q.answers.get(0));
      expect(callback).toHaveBeenCalled();
    });

    it('does not call callbacks for other completed questions', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const q1 = new Question({
        title: 'q1',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const q2 = new Question({
        title: 'q2',
        answers: List.of(
          new Answer({ text: 'kjasdlfk1', points: 2 }),
          new Answer({ text: '2l35iu', points: 3 }),
        )
      });

      const newSelectedAnswers = new SelectedAnswers();
      newSelectedAnswers.isCompleted.mockReturnValue(true);
      selectedAnswers.recordAnswer.mockReturnValue(newSelectedAnswers);
      selectedAnswers.isCompleted.mockImplementation(q => q === q1);

      makeCalculation(q1, q2)
        .onQuestionCompleted(q1, callback1)
        .onQuestionCompleted(q2, callback2)
        .recordAnswer(q1, q1.answers.get(0));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('chains callbacks on the same question', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });

      const newSelectedAnswers = new SelectedAnswers();
      newSelectedAnswers.isCompleted.mockReturnValue(true);
      selectedAnswers.recordAnswer.mockReturnValue(newSelectedAnswers);
      selectedAnswers.isCompleted.mockReturnValue(false);

      makeCalculation(q)
        .onQuestionCompleted(q, callback1)
        .onQuestionCompleted(q, callback2)
        .recordAnswer(q, q.answers.get(0));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });


  });

  describe('computeScore', () => {
    it('sums the score for all the quiz questions', () => {
      const q1 = new Question({
        title: 'q1',
        answers: List.of(
          new Answer({ text: 'alskq', points: 2 }),
          new Answer({ text: 'lk12j3', points: 3 }),
        )
      });
      const q2 = new Question({
        title: 'q2',
        answers: List.of(
          new Answer({ text: 'kjasdlfk1', points: 2 }),
          new Answer({ text: '2l35iu', points: 3 }),
        )
      });

      selectedAnswers.computeQuestionScore
        .mockReturnValueOnce(34)
        .mockReturnValueOnce(105);

      expect(makeCalculation(q1, q2).computeScore()).toBe(34 + 105);
      expect(selectedAnswers.computeQuestionScore).toHaveBeenCalledWith(q1);
      expect(selectedAnswers.computeQuestionScore).toHaveBeenCalledWith(q2);
    });
  });

  describe('completeMultipleChoiceQuestion', () => {
    it('calls the question completed and change callbacks and records completion', () => {
      const newSelectedAnswers = new SelectedAnswers();
      selectedAnswers.recordCompletedQuestion.mockReturnValue(newSelectedAnswers);
      newSelectedAnswers.isCompleted.mockReturnValue(true);
      selectedAnswers.isCompleted.mockReturnValue(false);

      const changeCallback = jest.fn();
      const completedCallback = jest.fn();
      const question = new Question({
        isMultipleChoice: true,
        title: 'What kind of candy do you like?',
        answers: List.of(
          new Answer({ title: 'Snickers' }),
          new Answer({ title: 'Starburst' }),
          new Answer({ title: 'Twizzler' }),
          new Answer({ title: 'Three Musketeers' }),
        ),
      });

      makeCalculation(question)
        .onChange(changeCallback)
        .onQuestionCompleted(question, completedCallback)
        .completeMultipleChoiceQuestion(question);

      expect(completedCallback).toHaveBeenCalled();
      expect(changeCallback).toHaveBeenCalledWith(expect.any(ScoreCalculation));
      expect(changeCallback.mock.calls[0][0].selectedAnswers).toBe(newSelectedAnswers);
      expect(selectedAnswers.recordCompletedQuestion).toHaveBeenCalledWith(question);
    });

    it('calls question completed callbacks for newly completed questions', () => {
      const newSelectedAnswers = new SelectedAnswers();
      selectedAnswers.recordCompletedQuestion.mockReturnValue(newSelectedAnswers);

      const completedCallback = jest.fn();
      const mainQuestion = new Question({
        title: 'main',
        subQuestions: List.of(
          new Question({
            isMultipleChoice: true,
            title: 'What kind of candy do you like?',
            answers: List.of(
              new Answer({ title: 'Snickers' }),
              new Answer({ title: 'Starburst' }),
              new Answer({ title: 'Twizzler' }),
              new Answer({ title: 'Three Musketeers' }),
            ),
          })
        ),
      });
      const subQuestion = mainQuestion.subQuestions.get(0);

      selectedAnswers.isCompleted.mockReturnValue(false);
      newSelectedAnswers.isCompleted.mockReturnValue(true);


      makeCalculation(mainQuestion)
        .onQuestionCompleted(mainQuestion, completedCallback)
        .completeMultipleChoiceQuestion(subQuestion);

      expect(completedCallback).toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('delegates to the entry set', () => {
      selectedAnswers.isSelected.mockReturnValue(true);
      const question = new Question({
        isMultipleChoice: true,
        title: 'What kind of candy do you like?',
        answers: List.of(
          new Answer({ title: 'Snickers' }),
          new Answer({ title: 'Starburst' }),
          new Answer({ title: 'Twizzler' }),
          new Answer({ title: 'Three Musketeers' }),
        ),
      });

      expect(
        makeCalculation(question)
          .recordAnswer(question, question.answers.get(0))
          .isSelected(question, question.answers.get(0))
      ).toBe(true);

      expect(selectedAnswers.isSelected).toHaveBeenCalledWith(question, question.answers.get(0));
    });
  });

  describe('clearCallbacks', () => {
    it('clears the callbacks', () => {
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const answerCallback = jest.fn();
      const questionCallback = jest.fn();

      makeCalculation(q)
        .onChange(answerCallback)
        .onQuestionCompleted(q, questionCallback)
        .clearCallbacks()
        .recordAnswer(q, q.answers.get(0));

      expect(answerCallback).not.toHaveBeenCalled();
      expect(questionCallback).not.toHaveBeenCalled();
    });
  });

  describe('deleteAnswer', () => {
    it('deletes the answer from the entry set', () => {
     const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const newSelectedAnswers = new SelectedAnswers();
      selectedAnswers.deleteAnswer.mockReturnValue(newSelectedAnswers);

      const calculation = makeCalculation().deleteAnswer(q, q.answers.get(0));
      expect(calculation.selectedAnswers).toBe(newSelectedAnswers);
      expect(selectedAnswers.deleteAnswer).toHaveBeenCalledWith(q, q.answers.get(0));
    });

    it('calls the change callback', () => {
      const callback = jest.fn();
      const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      const newSelectedAnswers = new SelectedAnswers();
      selectedAnswers.deleteAnswer.mockReturnValue(newSelectedAnswers);

      makeCalculation()
        .onChange(callback)
        .deleteAnswer(q, q.answers.get(0));
      expect(callback).toHaveBeenCalledWith(expect.any(ScoreCalculation));
      expect(callback.mock.calls[0][0].selectedAnswers).toBe(newSelectedAnswers);
    });
  });

  describe('hasAnswer', () => {
    it('delegates to the entry set', () => {
       const q = new Question({
        title: 'I got no subquestions',
        answers: List.of(
          new Answer({ text: 'a', points: 1 }),
          new Answer({ text: 'b', points: 2 }),
        ),
      });
      selectedAnswers.hasAnswer.mockReturnValue(true);
      expect(makeCalculation(q).hasAnswer(q)).toBe(true);
      expect(selectedAnswers.hasAnswer).toHaveBeenCalledWith(q);
    });
  });
});
