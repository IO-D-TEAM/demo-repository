package org.io_web.backend.questions;

/**
 * Class prepared to keep question, 4 possible answers, and correct answer
 */
public class Question {
    private String question;
    private String[] answers;
    private String correctAnswer;

    public Question(String question, String[] answers, String correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }
}
