package org.io_web.backend.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.io_web.backend.questions.Answer;
import org.io_web.backend.questions.Question;

public class TaskWrapper {
    Question question;
    Integer diceRoll;
    PlayerTask task;

    public TaskWrapper(Question question, Integer diceRoll, PlayerTask task){
        this.question = question;
        this.diceRoll = diceRoll;
        this.task = task;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Integer getDiceRoll() {
        return diceRoll;
    }

    public void setDiceRoll(Integer diceRoll) {
        this.diceRoll = diceRoll;
    }

    public PlayerTask getTask() {
        return task;
    }

    public void setTask(PlayerTask task) {
        this.task = task;
    }

    // Method to convert TaskWrapper object to JSON string
    public byte[] serialize() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsBytes(this);
        } catch (JsonProcessingException e){
            e.printStackTrace();
            return new byte[0];
        }
    }

}
