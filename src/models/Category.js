import Answer from './Answer';
import Immutable from 'immutable';

const Category = Immutable.Record({
  title: '',
  answers: new Immutable.List(),
});

Object.assign(Category.prototype, {

});

Category.deserialize = json => {
  json = Object.assign({}, json);
  if (!(json.answers && json.answers.length)) {
    throw new Error('answers is required');
  }
  json.answers = new Immutable.List(
    json.answers.map(a => Answer.deserialize(a))
  );
  return new Category(json);
};


export default Category;
