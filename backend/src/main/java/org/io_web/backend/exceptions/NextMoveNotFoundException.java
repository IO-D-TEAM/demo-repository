package org.io_web.backend.exceptions;

public class NextMoveNotFoundException extends RuntimeException {
    public NextMoveNotFoundException(String message) {
        super(message);
    }
}
