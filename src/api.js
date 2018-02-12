import axios from 'axios';
import Quiz from './models/Quiz';


export const fetchQuestions = () => (
  axios.get('./quiz.json').then(r => (
    Quiz.deserialize(r.data)
  ))
);
