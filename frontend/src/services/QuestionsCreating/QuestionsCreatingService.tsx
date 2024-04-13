import React, { FC, useEffect } from "react";
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";

/*{ 
    Centralized service to handle all question-related methods na utilities
    actualQuestion - question edited by QuestionEdit component! 
}*/ 
export default class QuestionService {
    private questions: QuestionInterface[] = [];
    private subscribers: Function[] = [];
    private index: number = 0;

    private actualQuestion: QuestionInterface = {
        question: "New Question",
        correctAnswer: "Undefined",
        answers: ["", "", "", ""]
    };

    constructor(){
        // Mock Question
        const question: QuestionInterface = {
            question: "What is the capital of France?",
            correctAnswer: "Paris",
            answers: ["Paris", "Berlin", "London", "Madrid"]
        };
        this.questions.push(question);
    
    }

    // Notify about change
    private notifySubscribers() {
        this.subscribers.forEach(subscriber => subscriber());
    }

    /* 
        This could be improved: The callback is currently ignored because multiple components 
        are listening for changes independently. Instead of sending data with the callback, 
        each component is responsible for fetching new data when notified of a change.
    */
    subscribe(callback: () => void) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: Function) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }

    getQuestions(): QuestionInterface[] {
        return this.questions;
    }

    getActualQuestion(): QuestionInterface {
        return this.actualQuestion;
    }

    // change edit question
    setActualQuestion(question: QuestionInterface, index: number): void {
        this.actualQuestion = question;
        this.index = index;
        this.notifySubscribers();
    }

    addQuestion() {
        const question: QuestionInterface = {
            question: "New Question",
            correctAnswer: "Undefined",
            answers: ["", "", "", ""]
        };
        this.questions.push(question);
        this.setActualQuestion(question, this.questions.lastIndexOf(question))
        this.notifySubscribers();
    }

    updateCorrectAnswer(correctAnswer: string){
        this.questions[this.index].correctAnswer = correctAnswer;
        this.setActualQuestion(this.questions[this.index], this.index);
    }

    updateQuestionAnswers(newAnswers: string[]){
        this.questions[this.index].answers = newAnswers;
        this.notifySubscribers();
    }

    updateQuestionValue(question: string){
        this.questions[this.index].question = question;
        this.notifySubscribers();
    }

    removeQuestion() {
        console.log(this.questions.length);
        this.questions.splice(this.index, 1);
        this.setActualQuestion({
            question: "",
            correctAnswer: "",
            answers: []
        }, 0);
        this.notifySubscribers();
    }
}

