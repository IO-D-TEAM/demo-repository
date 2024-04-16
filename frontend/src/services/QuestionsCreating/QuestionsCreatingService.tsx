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

const mockQuestion: QuestionInterface = {
  question: "Przykładowe pytanie",
  correctAnswer: "Odpowiedź 1",
  answers: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4"],
};

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
  const [questions, setQuestionsValue] =
    useState<QuestionInterface[]>(initialState); // Your initial questions data
  const [actualQuestion, setActualQuestionValue] = useState<QuestionInterface>(
    structuredClone(mockQuestion)
  ); // Your initial questions data
  const [index, setIndex] = useState<number>(-1);

  let subscribers: { callback: SubscriberCallback; dataIdentifier: string }[] =
    [];

  useEffect(() => {
    if (questions.length === 0 && index != -1)
      setActualQuestionValue(structuredClone(mockQuestion));
    notifySubscribers();
  }, [questions, actualQuestion]);

  const notifySubscribers = () => {
    subscribers.forEach((subscriber) => {
      if (subscriber.dataIdentifier === "question")
        if (actualQuestion) subscriber.callback(actualQuestion);

      if (subscriber.dataIdentifier === "questions")
        if (questions) subscriber.callback(questions);
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
    question: QuestionInterface,
    newIndex: number
  ): void => {
    setIndex(newIndex);
    setActualQuestionValue(question);
  };

  const getActualQuestion = (): QuestionInterface => {
    if (actualQuestion == null || questions.length === 0)
      return structuredClone(emptyQuestion);

    return actualQuestion;
  };

  const saveChanges = (): void => {
    if (!checkIfQuestionExists(actualQuestion))
      // If question exist, ignore it
      questions.push(structuredClone(actualQuestion));

    notifySubscribers();
  };

  const setQuestions = (newQuestions: QuestionInterface[]): void => {
    setQuestionsValue(newQuestions);

    if (newQuestions.length == 0)
      setActualQuestion(structuredClone(mockQuestion), -1);
  };

  const addQuestion = (): void => {
    if (index == -1) {
      setActualQuestionValue(structuredClone(emptyQuestion));
      setActualQuestionValue(structuredClone(emptyQuestion));
      notifySubscribers();
      return;
    }

    setIndex(-1);
  };

  const updateCorrectAnswer = (correctAnswer: string): void => {
    setActualQuestionValue((prevQuestion) => ({
      ...prevQuestion!,
      correctAnswer: correctAnswer,
    }));
    if (index !== -1 && questions.length > index) {
      setQuestionsValue((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index].correctAnswer = correctAnswer;
        return updatedQuestions;
      });
    }
  };

  const checkIfQuestionExists = (question: QuestionInterface): boolean => {
    if (questions.length == 0) return false;

    let copiedQuestions = [...questions]; // Create a copy of the original array
    return (
      copiedQuestions.findIndex((q) => q.question === question.question) !== -1
    );
  };

  const updateQuestionAnswers = (newAnswers: string[]): void => {
    setActualQuestionValue((prevQuestion) => ({
      ...prevQuestion!,
      answers: newAnswers,
    }));
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
