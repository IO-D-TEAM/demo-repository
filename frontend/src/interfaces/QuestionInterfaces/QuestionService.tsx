import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";

export type SubscriberCallback = (data: any) => void;

export interface QuestionService {
    subscribe: (callback: SubscriberCallback, dataIdentifier: string) => void;
    unsubscribe: (callback: SubscriberCallback) => void;
    getQuestions: () => QuestionInterface[];
    setActualQuestion: (question: QuestionInterface, newIndex: number) => void;
    removeQuestion: (question: QuestionInterface) => void;
    addQuestion: () => void;
    updateCorrectAnswer: (correctAnswer: string) => void;
    updateQuestionValue: (question: string) => void;
    updateQuestionAnswers: (newAnswers: string[]) => void;
    setQuestions: (questions: QuestionInterface[]) => void;
    saveChanges: () => void;
    getActualQuestion: () => QuestionInterface;
    getActualIndex:() => number;
}