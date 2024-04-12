import React, { FC, useEffect } from "react";
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";

export default class QuestionService {
    private questions: QuestionInterface[] = [];
    private subscribers: Function[] = [];
    private index: number = 0;

    private actualQuestion: QuestionInterface = {
        question: "",
        correctAnswer: "",
        answers: []
    };

    constructor(){
        for (let i = 0; i < 10; i++) {
            const question: QuestionInterface = {
                question: "What is the capital of France?",
                correctAnswer: "Paris",
                answers: ["Paris", "Berlin", "London", "Madrid"]
            };
            this.questions.push(question);
        }
    }

    private notifySubscribers() {
        this.subscribers.forEach(subscriber => subscriber(this.actualQuestion));
    }

    
    subscribe(callback: () => void) {
        this.subscribers.push(callback);
    }

    getQuestions(): QuestionInterface[] {
        return this.questions;
    }

    getActualQuestion(): QuestionInterface {
        return this.actualQuestion;
    }

      // Method to unsubscribe from actualQuestion changes
    unsubscribe(callback: Function) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }

    setActualQuestion(question: QuestionInterface, index: number): void {
        this.actualQuestion = question;
        this.index = index;
        this.notifySubscribers();
    }

    addQuestion(question: QuestionInterface) {
        this.questions.push(question);
    }

    updateQuestion(newAnswers: string[]){
        console.log(this.index);
        this.questions[this.index].answers = newAnswers;
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

