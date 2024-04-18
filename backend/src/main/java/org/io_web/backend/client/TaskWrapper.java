package org.io_web.backend.client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.questions.Question;

import java.io.Serializable;

@Getter @Setter
public class TaskWrapper{
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
        String json = "{\"question\":" + (question != null ? question : "null")
                + ",\"diceRoll\":" + diceRoll
                + ",\"task\":\"" + (task != null ? task.toString() : "null") + "\"}";
        return json.getBytes();
    }
}
