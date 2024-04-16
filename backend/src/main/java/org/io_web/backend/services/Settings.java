package org.io_web.backend.services;

import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.io.IOException;


@Getter
@FieldDefaults(makeFinal = true)
public class Settings {
    private int numberOfPlayers;
    private int normalFields;
    private int specialFields;
    private int timeForAnswer;
    private int timeForGame;
//    private ArrayList<Question> questions = new ArrayList<>();

    public Settings(int numberOfPlayers,
                    int normalFields,
                    int specialFields,
                    int timeForAnswer,
                    int timeForGame) throws IOException {
        this.numberOfPlayers = numberOfPlayers;
        this.normalFields = normalFields;
        this.specialFields = specialFields;
        this.timeForAnswer = timeForAnswer;
        this.timeForGame = timeForGame;
    }
}
