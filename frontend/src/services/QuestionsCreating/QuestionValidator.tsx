import React, { FC, useEffect } from "react";
import { QuestionInterface } from "../../interfaces/QuestionInterfaces/Question";

export default class QuestionValidationService {
    static validateQuestion(question: QuestionInterface): boolean {

        const uniqueAnswers = new Set(question.answers.map(answer => answer.trim().toLowerCase()));
        if (uniqueAnswers.size !== question.answers.length) {
            throw new Error("Odpowiedzi nie mogą się powtarzać!");
        }

        if (!question.question.trim()) {
            throw new Error("Brak pytania!");
        }

        if (!question.correctAnswer.trim()) {
            throw new Error("Poprawna odpowiedź nie może być pusta!");
        }

        if (question.answers.indexOf(question.correctAnswer) === -1) {
            throw new Error("Brak poprawnej odpowiedzi!");
        }

        if (question.answers.length != 2 && question.answers.length != 4) {
            throw new Error("Prawidłowa liczba odpowiedzi wynosi 2 lub 4!");
        }

        if (question.answers.some(answer => !answer.trim())) {
            throw new Error("Odpowiedzi nie mogą być puste!");
        }

        return true;
    }
}