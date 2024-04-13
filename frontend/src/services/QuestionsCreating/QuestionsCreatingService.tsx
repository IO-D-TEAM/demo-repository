import React, { FC, useEffect } from "react";
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";
import Popup from "./../../model/Popup/Popup";
import QuestionValidationService from "./QuestionValidator";
import { error } from "console";

/*{ 
    Centralized service to handle all question-related methods na utilities
    actualQuestion - question edited by QuestionEdit component! 
}*/ 
export default class QuestionService {
    private questions: QuestionInterface[] = [];
    private subscribers: Function[] = [];
    private index: number = 0;
    private unsavedChanges: boolean = false;


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

    // Notify about change
    private notifySubscribers() {
        this.subscribers.forEach(subscriber => subscriber(this.actualQuestion));
    }

    subscribe(callback: () => void) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: Function) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
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
            this.setActualQuestion(this.questions[0], 0);
            this.notifySubscribers();
            return;
        }

        this.questions.splice(this.questions.indexOf(question), 1)
        this.notifySubscribers();
    }
}

