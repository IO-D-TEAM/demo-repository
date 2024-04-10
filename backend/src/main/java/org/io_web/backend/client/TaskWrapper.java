package org.io_web.backend.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.questions.Question;

import java.io.Serializable;

@Getter @Setter
public class TaskWrapper implements Serializable {
    private Question question;
    private Integer diceRoll;
    private PlayerTask task;

    public TaskWrapper(Question question, Integer diceRoll, PlayerTask task){
        this.question = question;
        this.diceRoll = diceRoll;
        this.task = task;
    }

    // Method to convert TaskWrapper object to JSON string
    public byte[] serialize() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsBytes(this);
        } catch (JsonProcessingException e){
            return new byte[0];
        }
    }

}
