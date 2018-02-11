const SubQuestionModes = {
  ANSWER_ALL: Symbol(),
  ANSWER_ONE: Symbol(),
};

SubQuestionModes.deserialize = value => {
  if (!value) {
    return SubQuestionModes.ANSWER_ALL;
  }
  if (!SubQuestionModes[value]) {
    throw new Error('invalid subquestion mode ' + value);
  }
  return SubQuestionModes[value];
}

export default SubQuestionModes;


