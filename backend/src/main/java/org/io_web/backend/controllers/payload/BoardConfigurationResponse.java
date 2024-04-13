package org.io_web.backend.controllers.payload;

import org.io_web.backend.board.Field;

import java.util.List;

public record BoardConfigurationResponse(
        int gameDuration,
        int boardSize,
        List<Field> fieldSpeciality,
        List<PlayerResponse> players
) {
}
