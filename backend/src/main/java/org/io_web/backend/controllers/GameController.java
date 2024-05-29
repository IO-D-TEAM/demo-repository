package org.io_web.backend.controllers;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.services.GameService;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Rest controller main purpose is to handle REST Requests from client.
 */
@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;
    private final Logger LOGGER = LogManager.getLogger(GameController.class);

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * Handles the client's answer during the game session.
     *
     * @param gameId   the unique game identifier
     * @param clientId the unique client identifier
     * @param answer   the answer provided by the client
     * @return ResponseEntity with HttpStatus and game data.
     */
    @PostMapping("{gameId}/client/{clientId}")
    public ResponseEntity<?> giveAnswer(@PathVariable String gameId, @PathVariable String clientId, @RequestBody String answer) {
        LOGGER.info("Handling client answer for gameCode: {} and clientID: {}", gameId, clientId);

        // Let GameService take care of processing answer
        gameService.processAnswer(gameId, clientId, answer);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Handles end game request.
     *
     * @return ResponseEntity with HttpStatus
     */
    @PostMapping("/endGame")
    public ResponseEntity<?> endGame() {
        LOGGER.info("Handling end game request");

        gameService.endGame();
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Handles start game request.
     *
     * @return ResponseEntity with HttpStatus
     */
    @PostMapping("/startGame")
    public ResponseEntity<?> startGame() {
        LOGGER.info("Handling start game request");

        gameService.startGame();
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }


}
