package org.io_web.backend.board;

import java.io.Serializable;
import java.util.Objects;

import lombok.Getter;
import org.io_web.backend.models.Question;

@Getter
public class BoardMessage implements Serializable {

    private final String clientID;
    private final int positionChange;
    private final Question question;
    private final boolean endingMove;

    @Override
    public String toString() {
        return "BoardMessage{" +
                "clientID='" + clientID + '\'' +
                ", positionChange=" + positionChange +
                ", question=" + question +
                ", endingMove=" + endingMove +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        BoardMessage that = (BoardMessage) o;
        return positionChange == that.positionChange && endingMove == that.endingMove && Objects.equals(clientID, that.clientID) &&
                Objects.equals(question, that.question);
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(clientID);
        result = 31 * result + positionChange;
        result = 31 * result + Objects.hashCode(question);
        result = 31 * result + Boolean.hashCode(endingMove);
        return result;
    }

    public BoardMessage(String clientID, int positionChange, Question question, boolean endingMove) {
        this.clientID = clientID;
        this.positionChange = positionChange;
        this.question = question;
        this.endingMove = endingMove;
    }
}
