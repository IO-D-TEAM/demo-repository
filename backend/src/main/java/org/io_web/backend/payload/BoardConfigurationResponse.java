package org.io_web.backend.payload;

import java.util.List;

import org.io_web.backend.models.Field;

public record BoardConfigurationResponse(
        int gameDuration,
        int boardSize,
        List<Field> fieldSpeciality,
        java.util.HashSet<org.io_web.backend.models.Player> players
) {
}
