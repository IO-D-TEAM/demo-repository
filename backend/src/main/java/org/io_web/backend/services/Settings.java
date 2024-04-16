package org.io_web.backend.services;

import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.io.IOException;


@Getter
@FieldDefaults(makeFinal = true)
public class Settings {
    private int numberOfPlayers = 0;
    private int normalFields = 0;
    private int specialFields = 0;
    private int timeForAnswer = 0;
    private int timeForGame = 0;
//    private ArrayList<Question> questions = new ArrayList<>();

    public Settings() throws IOException {
    }
}
