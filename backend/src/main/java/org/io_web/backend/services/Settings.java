package org.io_web.backend.services;

import org.io_web.backend.questions.Question;

import java.util.ArrayList;


public record Settings(
        int numberOfPlayers,
       int normalFields,
       int specialFields,
       int timeForAnswer,
       int timeForGame,
       ArrayList<Question> questionsSet,
       int boardPattern
) {

}
