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
        this.subscribers.forEach(subscriber => subscriber());
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

    unsubscribe(callback: Function) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }

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
        this.notifySubscribers();
    }


    updateQuestionValue(question: QuestionInterface){
        this.actualQuestion = question;
        this.questions[this.index].question = question.question;
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

