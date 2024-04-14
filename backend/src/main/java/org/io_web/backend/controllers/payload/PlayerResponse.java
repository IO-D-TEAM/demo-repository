package org.io_web.backend.controllers.payload;

public record PlayerResponse(
        String id,
        String nickname,
        String color,
        int position
) {
}
