import axios from 'axios';
import QuestionList from './models/QuestionList';


export const fetchQuestions = () => (
  axios.get('/questions.json').then(r => (
    QuestionList.deserialize(r.data)
  ))
);
