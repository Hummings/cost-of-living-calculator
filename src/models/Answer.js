import Immutable from 'immutable';
import Question from './Question';

const Answer = Immutable.Record({
  text: "",
  points: 0,
  subQuestions: new Immutable.List(),
});

Object.assign(Answer.prototype, {

});

Answer.deserialize = json => {
  json = Object.assign({}, json);
  json.subQuestions = new Immutable.List(
    (json.subQuestions || []).map(q => Question.deserialize(q))
  );
  return new Answer(json);
}

export default Answer;
