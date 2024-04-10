package org.io_web.backend.questions;


import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * Class prepared to keep question, 4 possible answers, and correct answer
 */

public class Question implements Serializable {
    private String question;
    private String[] answers;
    private String correctAnswer;

    public Question(String question, String[] answers, String correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    @Override
    public int hashCode() {
        return question.hashCode();
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final Question other = (Question) obj;

        return this.question.equals(other.question);
    }
}
