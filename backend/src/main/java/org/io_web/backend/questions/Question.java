package org.io_web.backend.questions;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Arrays;

/**
 * Class prepared to keep question, 4 possible answers, and correct answer
 */

public class Question implements Serializable {
    private final String question;
    private final String[] answers;
    private final String correctAnswer;

    @JsonCreator
    public Question(@JsonProperty("question") String question,@JsonProperty("answers") String[] answers,@JsonProperty("correctAnswer") String correctAnswer) {
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
        return "Question{" +
                "question='" + question + '\'' +
                ", answers=" + Arrays.toString(answers) +
                ", correctAnswer='" + correctAnswer + '\'' +
                '}';
    }
}
