import React, { FC, useEffect, useState } from "react";
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";
import Popup from "./../../model/Popup/Popup";
import QuestionValidationService from "./QuestionValidator";
import { error } from "console";

type SubscriberCallback = (data: any) => void;

/*{ 
    Centralized service to handle all question-related methods na utilities
    actualQuestion - question edited by QuestionEdit component! 
}*/ 
export default class QuestionService {
    private questions: QuestionInterface[] = [];
    private subscribers: { callback: SubscriberCallback, dataIdentifier: string }[] = [];
    private index: number = 0;
    private unsavedChanges: boolean = false;

    // Empty template for question creating 
    private actualQuestion: QuestionInterface = {
        question: "Wpisz swoje pytanie!",
        correctAnswer: "",
        answers: []
    };

    constructor(){
        // Mock Question
        const question: QuestionInterface = {
            question: "What is the capital of France?",
            correctAnswer: "Paris",
            answers: ["Paris", "Berlin", "London", "Madrid"]
        };
        this.questions.push(question);
        this.setActualQuestion(question, 0);
    }
    
    notifySubscribers(): void {
        this.subscribers.forEach(subscriber => {
            if (subscriber.dataIdentifier === "question")
                subscriber.callback(this.actualQuestion);
            
            if (subscriber.dataIdentifier === "questions")
                subscriber.callback(this.questions);
        });
    }

    subscribe(callback: SubscriberCallback, dataIdentifier: string): void {
        this.subscribers.push({ callback, dataIdentifier });
    }

    unsubscribe(callback: SubscriberCallback): void {
        this.subscribers = this.subscribers.filter(subscriber => subscriber.callback !== callback);
    }

    getQuestions(): QuestionInterface[] {
        return this.questions;
    }

    setQuestions(questions: QuestionInterface[]): void {
        this.questions = questions;
        this.setActualQuestion(questions[0], 0);
        this.notifySubscribers();
    }

    getActualQuestion(): QuestionInterface {
        if(this.actualQuestion == null){
            return {
                question: "What is the capital of France?",
                correctAnswer: "Paris",
                answers: ["Paris", "Berlin", "London", "Madrid"]
            };
        }
        return this.actualQuestion;
    }

    getActualIndex(): number {
        return this.index;
    }

    getUnsavedChanges(): boolean {
        return this.unsavedChanges;
    }

    isQuestionPresent(questionValue: string): boolean {
        return this.questions.some(question => question.question === questionValue);
    }

    setActualQuestion(question: QuestionInterface, index: number): void {
        this.actualQuestion = question;
        this.index = index;
        this.notifySubscribers();
    }

    saveChanges() : void {

        if(this.index == -1)
            this.questions.push(this.actualQuestion);

        this.index = this.questions.indexOf(this.actualQuestion);
        this.notifySubscribers();
    }

    addQuestion() : void {
        const question: QuestionInterface = {
            question: "Wpisz swoje pytanie!",
            correctAnswer: "",
            answers: []
        };

        if(this.index === -1){
            this.notifySubscribers();
            return;
        }

        this.index = -1;
        this.actualQuestion = question;
        this.notifySubscribers();
    }

    updateCorrectAnswer(correctAnswer: string) : void {
        this.actualQuestion.correctAnswer = correctAnswer;
        this.notifySubscribers();
        this.notifySubscribers();
    }

    updateQuestionAnswers(newAnswers: string[]) : void {
        this.actualQuestion.answers = newAnswers;

        if(this.actualQuestion.answers.length == 1)
            this.actualQuestion.correctAnswer = newAnswers[0];

        this.notifySubscribers();
    }

    updateQuestionValue(question: string) : void {
        this.actualQuestion.question = question;
        this.notifySubscribers();
    }

    removeQuestion(question: QuestionInterface) : void {
        if(question === this.actualQuestion){
            this.questions.splice(this.questions.indexOf(question), 1)

            if(this.questions.length == 0) // Mock question when ther is no questions in array
                this.setActualQuestion({
                    question: "What is the capital of France?",
                    correctAnswer: "Paris",
                    answers: ["Paris", "Berlin", "London", "Madrid"]
                }, 0)
            else
                this.setActualQuestion(this.questions[0], 0);

            this.notifySubscribers();
            return;
        }

        this.questions.splice(this.questions.indexOf(question), 1)
        this.notifySubscribers();
    }
}

