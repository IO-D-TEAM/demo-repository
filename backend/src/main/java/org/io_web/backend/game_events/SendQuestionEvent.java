package org.io_web.backend.game_events;

import org.springframework.context.ApplicationEvent;

public class SendQuestionEvent extends ApplicationEvent {
    public SendQuestionEvent(Object source) {
        super(source);
    }
}
