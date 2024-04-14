import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";
import {QuestionService, SubscriberCallback } from "../../interfaces/QuestionInterfaces/QuestionService"; 

const QuestionServiceContext = createContext<QuestionService | undefined>(undefined);

// This is to allow components to use our service 
export const useQuestionService = () => {
    const context = useContext(QuestionServiceContext);
    if (!context) {
        throw new Error('useQuestionService must be used within a QuestionServiceProvider');
    }
    return context;
};

interface QuestionServiceProviderProps {
    children: ReactNode;
}

const mockQuestion: QuestionInterface = {
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    answers: ["Paris", "Berlin", "London", "Madrid"]
}

const initialState: QuestionInterface[] = [
    mockQuestion
]; // Your initial questions data


// Main service functionality
export const QuestionServiceProvider: React.FC<QuestionServiceProviderProps> = ({ children }) => {
    const [questions, setQuestionsValue] = useState<QuestionInterface[]>(initialState); // Your initial questions data
    const [actualQuestion, setActualQuestionValue] = useState<QuestionInterface>(mockQuestion); // Your initial questions data
    const [index, setIndex] = useState<number>(0);

    let subscribers: { callback: SubscriberCallback, dataIdentifier: string }[] = [];

    useEffect(() => {
        notifySubscribers();
    }, [questions, actualQuestion]);

    const notifySubscribers = () => {
        subscribers.forEach(subscriber => {
        if (subscriber.dataIdentifier === "question")
            subscriber.callback(actualQuestion);
        
        if (subscriber.dataIdentifier === "questions")
            subscriber.callback(questions);
        });
    };

    const subscribe = (callback: SubscriberCallback, dataIdentifier: string) => {
        subscribers.push({ callback, dataIdentifier });
    };

    const unsubscribe = (callback: SubscriberCallback) => {
        subscribers = subscribers.filter(subscriber => subscriber.callback !== callback);
    };

    const getQuestions = (): QuestionInterface[] => {
        return questions;
    }

    const getActualIndex = (): number  => {
        return index;
    }

    const setActualQuestion = (question: QuestionInterface, newIndex: number): void => {
        setIndex(newIndex);
        setActualQuestionValue(question);
    }

    const getActualQuestion = (): QuestionInterface => {
        if(actualQuestion == null){
            return {
                question: "What is the capital of France?",
                correctAnswer: "Paris",
                answers: ["Paris", "Berlin", "London", "Madrid"]
            };
        }
        return actualQuestion;
    }

    const saveChanges = () : void  => {

        if(index == -1)
            questions.push(actualQuestion);

        setIndex(questions.indexOf(actualQuestion));
    }

    const setQuestions = (newQuestions: QuestionInterface[]): void  => {
        setQuestionsValue(newQuestions);
        setActualQuestion(questions[0], 0);
    }

    const addQuestion = () : void => {
        const question: QuestionInterface = {
            question: "Wpisz swoje pytanie!",
            correctAnswer: "",
            answers: []
        };

        if(index === -1){
            notifySubscribers();
            return;
        }

        setIndex(-1);
        setActualQuestionValue(question);
    }

    const updateCorrectAnswer = (correctAnswer: string) : void => {
        setActualQuestionValue(prevQuestion => ({ ...prevQuestion!, correctAnswer: correctAnswer}))
        if (index !== -1 && questions.length > index) {
            setQuestionsValue(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[index].correctAnswer = correctAnswer;
                return updatedQuestions;
            });
        }
    }

    const updateQuestionAnswers = (newAnswers: string[]) : void => {
        setActualQuestionValue(prevQuestion => ({ ...prevQuestion!, answers: newAnswers}))
        if (index !== -1 && questions.length > index) {
            setQuestionsValue(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[index].answers = newAnswers;
                return updatedQuestions;
            });
        }

        // if(actualQuestion.answers.length == 1)
        //     setActualQuestionValue(prevQuestion => ({ ...prevQuestion!, correctAnswer: newAnswers[0]}))
    }

    const updateQuestionValue = (newQuestion: string) : void => {
        if (index !== -1 && questions.length > index) {
            setQuestionsValue(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[index].question = newQuestion;
                return updatedQuestions;
            });
        }

        setActualQuestionValue(prevQuestion => ({ ...prevQuestion!, question: newQuestion}))
    }

    const removeQuestion = (question: QuestionInterface): void => {
        if (question === actualQuestion) {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(updatedQuestions.indexOf(question), 1);

            if (updatedQuestions.length === 0)
                setActualQuestion(mockQuestion, 0);
            else 
                setActualQuestion(updatedQuestions[0], 0);

            setQuestions(updatedQuestions);
        } else {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(updatedQuestions.indexOf(question), 1);
            setQuestions(updatedQuestions);
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
        getActualIndex
    };

    return (
        <QuestionServiceContext.Provider value={service}>
            {children}
        </QuestionServiceContext.Provider>
    );
};
