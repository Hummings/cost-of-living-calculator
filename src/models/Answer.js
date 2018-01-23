import Immutable from 'immutable';
import Question from './Question';

const Answer = Immutable.Record({
  text: "",
  points: 0,
  subquestions: new Immutable.List(),
});

Object.assign(Answer.prototype, {

});

Answer.deserialize = json => {
  json = Object.assign({}, json);
  json.subquestions = new Immutable.List(
    (json.subquestions || []).map(q => Question.deserialize(q))
  );
  return new Answer(json);
}

export default Answer;
