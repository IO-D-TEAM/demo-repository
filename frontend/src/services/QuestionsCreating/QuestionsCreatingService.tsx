import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";
import {
  QuestionService,
  SubscriberCallback,
} from "../../interfaces/QuestionInterfaces/QuestionService";
import QuestionValidationService from "./QuestionValidator";

const QuestionServiceContext = createContext<QuestionService | undefined>(
  undefined
);

// This is to allow components to use our service
export const useQuestionService = () => {
  const context = useContext(QuestionServiceContext);
  if (!context) {
    throw new Error(
      "useQuestionService must be used within a QuestionServiceProvider"
    );
  }
  return context;
};

interface QuestionServiceProviderProps {
  children: ReactNode;
}

// Mock question to display when there is not other questions
const mockQuestion: QuestionInterface = {
  question: "Przykładowe pytanie",
  correctAnswer: "Odpowiedź 1",
  answers: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4"],
};

// New Question template
const emptyQuestion: QuestionInterface = {
  question: "Wpisz swoje pytanie",
  correctAnswer: "",
  answers: [],
};

const initialState: QuestionInterface[] = [];

// Main service functionality
export const QuestionServiceProvider: React.FC<
  QuestionServiceProviderProps
> = ({ children }) => {
  const [questions, setQuestionsValue] = useState<QuestionInterface[]>(initialState); // Your initial questions data
  const [actualQuestion, setActualQuestionValue] = useState<QuestionInterface>(structuredClone(mockQuestion)); // Your initial questions data

  // index stands for actual edited question 
  // index == -1 means there is new question edited  
  const [index, setIndex] = useState<number>(-1); 

  let subscribers: { callback: SubscriberCallback; dataIdentifier: string }[] = [];

  useEffect(() => {
    // display mock question when there is no questions 
    if (questions.length === 0 && index != -1){
      setActualQuestionValue(structuredClone(mockQuestion));
      setIndex(-1);
    }
    notifySubscribers();
  }, [questions, actualQuestion]);

  // handle callbacks 
  const notifySubscribers = () => {
    subscribers.forEach((subscriber) => {
      // "Question" - subscriber needs only information about actual question
      if (subscriber.dataIdentifier === "question")
        if (actualQuestion) subscriber.callback(actualQuestion, index);

      // "Questions" - subscriber needs to know all questions
      if (subscriber.dataIdentifier === "questions")
        if (questions) subscriber.callback(questions, index);
    });
  };

  const subscribe = (callback: SubscriberCallback, dataIdentifier: string) => {
    subscribers.push({ callback, dataIdentifier });
  };

  const unsubscribe = (callback: SubscriberCallback) => {
    subscribers = subscribers.filter(
      (subscriber) => subscriber.callback !== callback
    );
  };

  const getQuestions = (): QuestionInterface[] => {
    return questions;
  };

  const getActualIndex = (): number => {
    return index;
  };

  const setActualQuestion = (
    newQuestion: QuestionInterface,
    newIndex: number
  ): void => {
    setIndex(newIndex);
    setActualQuestionValue(newQuestion);
  };

  const getActualQuestion = (): QuestionInterface => {
    if (actualQuestion == null || questions.length === 0)
      return structuredClone(emptyQuestion);

    return actualQuestion;
  };

  // Save changes execute when client want to save/add his question
  // If there is no similar question, then just add it 
  const saveChanges = (): void => {

    // If question is not in set then add new and allow user to enter 
    // new question from emptyQuestion Template
    if (!QuestionValidationService.isQuestionInSet(questions,actualQuestion)){
      questions.push(structuredClone(actualQuestion));
      setActualQuestion(structuredClone(emptyQuestion), -1);
    }

    notifySubscribers();
  };

  // Set questions from Import component.
  // After import focus on fist question from set or on mock.
  const setQuestions = (newQuestions: QuestionInterface[]): void => {
    setQuestionsValue(newQuestions);

    if (newQuestions.length == 0)
      setActualQuestion(structuredClone(mockQuestion), -1);

    notifySubscribers();
  };

  // When clients wants to add new question 
  // set index to -1 
  const addQuestion = (): void => {
    if (index == -1) {
      setActualQuestionValue(structuredClone(emptyQuestion));
      notifySubscribers();
      return;
    }

    setIndex(-1);
  };

  // Update edited question
  const updateCorrectAnswer = (correctAnswer: string): void => {
    setActualQuestionValue((prevQuestion) => ({
      ...prevQuestion!,
      correctAnswer: correctAnswer,
    }));

    // Update question in question list.
    if (index !== -1 && questions.length > index) {
      setQuestionsValue((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index].correctAnswer = correctAnswer;
        return updatedQuestions;
      });
    }
  };

  const updateQuestionAnswers = (newAnswers: string[]): void => {
    setActualQuestionValue((prevQuestion) => ({
      ...prevQuestion!,
      answers: newAnswers,
    }));

    // Update question in question list.
    if (index !== -1 && questions.length > index) {
      setQuestionsValue((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index].answers = newAnswers;
        return updatedQuestions;
      });
    }
  };

  const updateQuestionValue = (newQuestion: string): void => {
    if (index != -1) {
      setQuestionsValue((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index].question = newQuestion;
        return updatedQuestions;
      });
    }

    setActualQuestionValue((prevQuestion) => ({
      ...prevQuestion!,
      question: newQuestion,
    }));
  };

  const removeQuestion = (question: QuestionInterface): void => {
    const updatedQuestions = [...questions];
    const questionIndex = questions.indexOf(question);
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);

    if (question == actualQuestion) {
      setActualQuestion(structuredClone(mockQuestion), -1);
    } else if (questionIndex < index) {
      setIndex(index - 1);
    }
  };

  const service: QuestionService = {
    subscribe,
    unsubscribe,
    getQuestions,
    setActualQuestion,
    removeQuestion,
    addQuestion,
    updateQuestionValue,
    updateQuestionAnswers,
    updateCorrectAnswer,
    setQuestions,
    saveChanges,
    getActualQuestion,
    getActualIndex,
  };

  return (
    <QuestionServiceContext.Provider value={service}>
      {children}
    </QuestionServiceContext.Provider>
  );
};
