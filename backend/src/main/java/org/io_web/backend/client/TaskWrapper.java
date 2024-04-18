package org.io_web.backend.client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.questions.Question;

import java.io.Serializable;

@Getter
@Setter
public class TaskWrapper implements Serializable {
    private static final long serialVersionUID = 1L; // Ensure version compatibility

    private Question question;
    private Integer diceRoll;
    private PlayerTask task;

    @JsonCreator
    public TaskWrapper(@JsonProperty("question") Question question,
                       @JsonProperty("diceRoll") Integer diceRoll,
                       @JsonProperty("task") PlayerTask task) {
        this.question = question;
        this.diceRoll = diceRoll;
        this.task = task;
    }

    public byte[] serialize() {
        StringBuilder str = new StringBuilder();
        str.append("{\"question\":");

        if (this.question != null)
            str.append(question);
        else
            str.append("\"" + null + "\"");
        str.append(",\"diceRoll\":" + diceRoll + ",\"task\":" + "\"" + this.task.toString() + "\"}");
        return str.toString().getBytes();
    }

}
