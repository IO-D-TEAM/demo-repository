package org.io_web.backend.board;

import org.io_web.backend.questions.Question;

public class BoardMessage {
    private final String clientID;
    private final int positionChange;
    private final Question question;

    public BoardMessage(String clientID, int positionChange, Question question) {
        this.clientID = clientID;
        this.positionChange = positionChange;
        this.question = question;
    }
}
