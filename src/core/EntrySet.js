import { Record } from 'Immutable';

class Entry extends Record({ selectedAnswers: List() }) {
  constructor() {
    super();
  }
}

class EnrySet extends Record({ entries: List() }) {
  constructor() {
    super();
  }
}


