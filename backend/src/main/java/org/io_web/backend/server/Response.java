package org.io_web.backend.server;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.questions.Question;
import org.springframework.http.HttpStatus;


@Getter
@Setter
public class Response {
    private HttpStatus status;

    private String message;

    private String clientId;

    private GameStatus gameStatus;

    private PlayerTask task;

    private Question question = null;

    private Integer dice = 0;


    public Response() {};
    public Response(PlayerTask task, Question question, Integer dice) {
        this.task = task;
        this.question = question;
        this.dice = dice;
    }
}
