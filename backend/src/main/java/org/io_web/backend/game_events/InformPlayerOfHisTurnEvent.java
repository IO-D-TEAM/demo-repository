package org.io_web.backend.game_events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class InformPlayerOfHisTurnEvent extends ApplicationEvent {
    private final int diceRoll;

    public InformPlayerOfHisTurnEvent(Object source, int diceRoll) {
        super(source);
        this.diceRoll = diceRoll;
    }
}
