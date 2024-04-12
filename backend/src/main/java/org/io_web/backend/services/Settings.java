package org.io_web.backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.io_web.backend.questions.Question;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;


@Getter
@FieldDefaults(makeFinal = true)
public class Settings{
    int numberOfPlayers,
        numberFields,
        specialFields,
        timeForAnswer,
        timeForGame;
    ArrayList<Question> questions;
public Settings(int numberOfPlayers,
                int normalFields,
                int specialFields,
                int timeForAnswer,
                int timeForGame,
                MultipartFile questionsFile) throws RuntimeException{

    this.numberOfPlayers = numberOfPlayers;
    this.numberFields = normalFields;
    this.specialFields = specialFields;
    this.timeForAnswer = timeForAnswer;
    this.timeForGame = timeForGame;
    ObjectMapper objectMapper = new ObjectMapper();
    try {
        this.questions = objectMapper.readValue(questionsFile.getInputStream(), new TypeReference<>() {});

    } catch (IOException e) {
        throw new RuntimeException(e);
    }


    }
}
