import Answer from './Answer';
import Category from './Category';
import Immutable from 'immutable';

const Question = Immutable.Record({
  title: "",
  answers: new Immutable.List(),
  categories: new Immutable.List(),
});

Object.assign(Question.prototype, {
  getValue() {


  },
});

Question.deserialize = json => {
  json = Object.assign({}, json);
  const hasAnswersSpecified = json.answers && json.answers.length;
  const hasCategoriesSpecified = json.categories && json.categories.length;

  if ((hasAnswersSpecified && hasCategoriesSpecified)
     || (!hasAnswersSpecified && !hasCategoriesSpecified)) {
    throw new Error('Either answers or categories is required but not both');
  }


  if (hasAnswersSpecified) {
    json.answers = new Immutable.List(
      json.answers.map(a => Answer.deserialize(a))
    );
  }
  if (hasCategoriesSpecified) {
    json.categories = new Immutable.List(
      json.categories.map(c => Category.deserialize(c))
    );
  }
  return new Question(json);
}

export default Question;
