package org.io_web.backend.server;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.questions.Answer;

@Getter
@Setter
public class ClientAnswer {
    private int dice;
    private Answer answer;
}
