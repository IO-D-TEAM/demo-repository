package org.io_web.backend.services;

import lombok.Getter;

import org.io_web.backend.questions.Question;

import java.util.ArrayList;


@Getter
public class Settings {
    private int numberOfPlayers;
    private int normalFields;
    private int specialFields;
    private int timeForAnswer;
    private int timeForGame;

    private ArrayList<Question> questions;

    public Settings() {}

    @Override
    public String toString() {
        return "Settings{" +
                "numberOfPlayers=" + numberOfPlayers +
                ", normalFields=" + normalFields +
                ", specialFields=" + specialFields +
                ", timeForAnswer=" + timeForAnswer +
                ", timeForGame=" + timeForGame +
                ", questions=" + questions +
                '}';
    }
}
