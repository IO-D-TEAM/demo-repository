import { Question } from "./../models/Question";

export type SubscriberCallback = (data: any, index: number) => void;

export interface QuestionService {
  subscribe: (callback: SubscriberCallback, dataIdentifier: string) => void;
  unsubscribe: (callback: SubscriberCallback) => void;
  getQuestions: () => Question[];
  setActualQuestion: (question: Question, newIndex: number) => void;
  removeQuestion: (question: Question) => void;
  addQuestion: () => void;
  updateCorrectAnswer: (correctAnswer: string) => void;
  updateQuestionValue: (question: string) => void;
  updateQuestionAnswers: (newAnswers: string[]) => void;
  setQuestions: (questions: Question[]) => void;
  saveChanges: () => void;
  getActualQuestion: () => Question;
  getActualIndex: () => number;
}
