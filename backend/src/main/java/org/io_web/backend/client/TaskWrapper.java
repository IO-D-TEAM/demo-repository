package org.io_web.backend.client;

import java.io.Serializable;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.models.Question;

@Getter
@Setter
public class TaskWrapper implements Serializable {
    private Question question;
    private Integer diceRoll;
    private PlayerTask task;

    public TaskWrapper(Question question, Integer diceRoll, PlayerTask task) {
        this.question = question;
        this.diceRoll = diceRoll;
        this.task = task;
    }

    @Override
    public String toString() {
        return "TaskWrapper{" +
                "question=" + question +
                ", diceRoll=" + diceRoll +
                ", task=" + task +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        TaskWrapper that = (TaskWrapper) o;
        return Objects.equals(getQuestion(), that.getQuestion()) && Objects.equals(getDiceRoll(), that.getDiceRoll()) &&
                getTask() == that.getTask();
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(getQuestion());
        result = 31 * result + Objects.hashCode(getDiceRoll());
        result = 31 * result + Objects.hashCode(getTask());
        return result;
    }


}
