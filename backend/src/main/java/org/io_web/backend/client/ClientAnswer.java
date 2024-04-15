package org.io_web.backend.client;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.questions.Answer;

import java.io.Serializable;

@Getter
@Setter
public class ClientAnswer implements Serializable {
    private int dice;
    private Answer answer;
}
