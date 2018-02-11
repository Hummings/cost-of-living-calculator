import Immutable from 'immutable';
import Question from './Question';
import SubQuestionModes from './SubQuestionModes';

import { dasherize } from '../utils';

const Answer = Immutable.Record({
  id: "",
  text: "",
  points: 0,
  subQuestions: new Immutable.List(),
  subQuestionMode: SubQuestionModes.ANSWER_ALL,
});

Object.assign(Answer.prototype, {
  getId() {
    if (this.id) {
      return this.id;
    } else {
      return dasherize(this.text);
    }
  },

  hasSubQuestions() {
    return !!this.subQuestions.size;
  },
});

Answer.deserialize = json => {
  json = Object.assign({}, json);
  json.subQuestions = new Immutable.List(
    (json.subQuestions || []).map(q => Question.deserialize(q))
  );

  json.subQuestionMode = SubQuestionModes.deserialize(json.subQuestionMode);

  return new Answer(json);
}

export default Answer;
