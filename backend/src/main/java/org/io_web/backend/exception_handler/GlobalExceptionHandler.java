package org.io_web.backend.exception_handler;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.exceptions.GameNotFoundException;
import org.io_web.backend.exceptions.NotYourTurnException;
import org.io_web.backend.exceptions.PlayerNotFoundException;
import org.io_web.backend.exceptions.PlayerWithThisIdExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger LOGGER = LogManager.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(GameNotFoundException.class)
    public ResponseEntity<Object> handleGameNotFoundException(GameNotFoundException ex) {
        LOGGER.error("GameNotFoundException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(NotYourTurnException.class)
    public ResponseEntity<Object> handleNotYourTurnException(NotYourTurnException ex) {
        LOGGER.error("NotYourTurnException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(PlayerNotFoundException.class)
    public ResponseEntity<Object> handlePlayerNotFoundException(PlayerNotFoundException ex) {
        LOGGER.error("PlayerNotFoundException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(PlayerWithThisIdExistsException.class)
    public ResponseEntity<Object> handlePlayerWithThisIdExistsException(PlayerWithThisIdExistsException ex) {
        LOGGER.error("PlayerWithThisIdExistsException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> unknownException(RuntimeException ex) {
        LOGGER.error("Unknown exception: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown exception");
    }

}
