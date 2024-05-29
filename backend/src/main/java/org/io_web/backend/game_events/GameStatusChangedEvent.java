package org.io_web.backend.game_events;

import lombok.Getter;
import org.io_web.backend.game.GameStatus;
import org.springframework.context.ApplicationEvent;

@Getter
public class GameStatusChangedEvent extends ApplicationEvent {
    private final GameStatus newStatus;

    public GameStatusChangedEvent(Object source, GameStatus newStatus) {
        super(source);
        this.newStatus = newStatus;
    }

}
