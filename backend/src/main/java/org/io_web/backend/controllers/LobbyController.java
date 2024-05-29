package org.io_web.backend.controllers;


import java.util.ArrayList;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.entities.Client;
import org.io_web.backend.services.LobbyService;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lobby")
public class LobbyController {
    private final Logger LOGGER = LogManager.getLogger(LobbyController.class);
    private final LobbyService service;

    @Autowired
    public LobbyController(LobbyService service) {
        this.service = service;
    }

    /**
     * Listing players request
     *
     * @return list of players
     */
    @GetMapping("/players")
    public ArrayList<Client> sendPlayers() {
        LOGGER.info("Handling get request for listing players");
        return new ArrayList<>(service.getClients());
    }

    /**
     * Returns information if game with code is existing.
     *
     * @param gameCode - Unique game identifier
     * @return - ResponseEntity with HttpStatus and answer
     * @method GET
     */
    @GetMapping("{gameCode}/join_game")
    public ResponseEntity<String> validateGameCode(@PathVariable String gameCode) {
        LOGGER.info("Handling existing game validation for game with id: {}", gameCode);

        this.service.validateGamecode(gameCode);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Handles situation when client is observing the game. Provide user with information
     * about questions, dice throwing etc.
     *
     * @param gameCode Unique game identifier
     * @param clientID Unique user identifier
     * @return ResponseEntity wih HttpStatus and Game Data.
     */
    @GetMapping("{gameCode}/client/{clientID}")
    public ResponseEntity<String> attendGame(@PathVariable String gameCode, @PathVariable String clientID) {
        LOGGER.info("Handling attend game for clientID: {} for game: {}", clientID, gameCode);

        Client client = this.service.attendGame(gameCode, clientID);
        return ResponseFactory.createResponse(HttpStatus.OK, client);
    }

    /**
     * Handles the process of a client joining a game session.
     *
     * @param gameCode   Unique game identifier
     * @param newClient2 Client object representing new client attempting to join.
     * @return ResponseEntity wih HttpStatus and additional data.
     * @method POST
     *
     * <p>The method handles scenarios based on game status:<ul>
     * <li> If the game is in lobby, check if nick is available </li>
     * <li> If the game is pending then: <ul>
     * <li> Reconnect client if client was disconnected during the game </li>
     * <li> Add player as spectator if lobby is not full </li>
     * </ul></ul>
     */
    @PostMapping("{gameCode}/join_game")
    public ResponseEntity<String> joinGame(@PathVariable String gameCode, @RequestBody Client newClient) {
        LOGGER.info("Handling joining game session for client: {}, game: {}", newClient.getNickname(), gameCode);
        Client client = this.service.joinGame(gameCode, newClient);

        return ResponseFactory.createResponse(HttpStatus.OK, client);
    }

    /**
     * Handles delete player request.
     *
     * @param client2 description.
     * @return ResponseEntity wih HttpStatus and additional data.
     */
    @PostMapping("/deletePlayer")
    public ResponseEntity<String> deletePlayer(@RequestBody Client client2) {
        LOGGER.info("Handling delete player for client: {}", client2.getNickname());
        return this.service.deletePlayer(client2);
    }
}
