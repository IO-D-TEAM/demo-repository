package org.io_web.backend.game_events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UpdateBoardViewEvent extends ApplicationEvent {
    private final int move;
    private final boolean isEndingMove;

    public UpdateBoardViewEvent(Object source, int move, boolean isEndingMove) {
        super(source);
        this.move = move;
        this.isEndingMove = isEndingMove;
    }

}
