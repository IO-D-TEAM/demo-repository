package org.io_web.backend.board;

import org.io_web.backend.questions.Question;

public class BoardMessage {
    private final String clientID;
    private final int positionChange;
    private final Question question;

    private final boolean endingMove;

    public BoardMessage(String clientID, int positionChange, Question question, boolean endingMove) {
        this.clientID = clientID;
        this.positionChange = positionChange;
        this.question = question;
        this.endingMove = endingMove;
    }
}
