package org.io_web.backend.models;

import java.io.Serializable;

import lombok.Getter;

/**
 * Class prepared to keep question, 4 possible answers, and correct answer
 */

@Getter
public class Question implements Serializable {
    private final String question;
    private final String[] answers;
    private final String correctAnswer;

    public Question(
            String question,
            String[] answers,
            String correctAnswer
    ) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    public boolean isCorrect(String answer) {
        return answer.equals(correctAnswer);
    }

    @Override
    public int hashCode() {
        return question.hashCode();
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Question other = (Question) obj;

        return this.question.equals(other.question);
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        str.append("{");
        str.append("\"question\": \"").append(question).append("\", ");
        str.append("\"answers\": [");

        // Append each answer
        for (int i = 0; i < answers.length; i++) {
            str.append("\"").append(answers[i]).append("\"");
            if (i < answers.length - 1) {
                str.append(", ");
            }
        }

        str.append("], ");
        str.append("\"correctAnswer\": \"").append(correctAnswer).append("\"");
        str.append("}");

        return str.toString();
    }


}
