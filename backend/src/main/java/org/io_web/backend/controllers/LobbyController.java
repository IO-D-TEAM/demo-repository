package org.io_web.backend.controllers;

import org.io_web.backend.client.*;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.utilities.ResponseFactory;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/lobby")
public class LobbyController {
    private final ClientPool clientPool = new ClientPool();

    private final SharedDataService dataService;
    private final CommunicationService communicationService;
    private final GameEngine gameEngine;
    private final List<Client> clients = new ArrayList<>();
    private final int maxPlayers = 20;

    @Autowired
    public LobbyController(SharedDataService dataService, CommunicationService communicationService, GameEngine gameEngine){
        this.dataService = dataService;
        this.gameEngine = gameEngine;
        this.communicationService = communicationService;
    }

    @GetMapping("/players")
    public ArrayList<Client> sendPlayers() {
        return this.dataService.getClientPool().getClients();
    }

    /**
     * Returns information if game with code is existing.
     *
     * @method GET
     * @param gameCode - Unique game identifier
     * @return - ResponseEntity with HttpStatus and answer
     */
    @GetMapping("{gameCode}/join_game")
    public ResponseEntity<String> mainPage(@PathVariable String gameCode) {
        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");
        }
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
    public ResponseEntity<Object> attendGame(@PathVariable String gameCode, @PathVariable String clientID) {

        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");
        }
        Client client = this.dataService.getClientPool().getClientById(clientID);

        if (client == null) {
            return ResponseFactory.createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");
        }
        return ResponseFactory.createResponse(HttpStatus.OK, client);
    }

    /**
     * Handles the process of a client joining a game session.
     *
     * @method POST
     * @param gameCode Unique game identifier
     * @param newClient Client object representing new client attempting to join.
     * @return ResponseEntity wih HttpStatus and additional data.
     *
     *  <p>The method handles scenarios based on game status:<ul>
     *  <li> If the game is in lobby, check if nick is available </li>
     *  <li> If the game is pending then: <ul>
     *      <li> Reconnect client if client was disconnected during the game </li>
     *      <li> Add player as spectator if lobby is not full </li>
     *  </ul></ul>
     */
    @PostMapping("{gameCode}/join_game")
    public ResponseEntity<Object> joinGame(@PathVariable String gameCode, @RequestBody Client newClient) {
        System.out.println("[LOG] Post-Mapping join game");

        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }

        boolean reconnected = false;
        ResponseEntity<Object> response = null;

        switch (gameEngine.getGameStatus()) {
            case LOBBY, ENDED:
                if (this.dataService.getClientPool().isClientPresent(newClient.getNickname())) {
                    return ResponseFactory.createResponse(HttpStatus.CONFLICT, "Nickname already in use");
                }
                break;
            case PENDING:
                Client prevClient = this.dataService.getClientPool().getClientByNickname(newClient.getNickname());
                if (prevClient != null) {
                    if (prevClient.getStatus() == ClientStatus.LOST_CONNECTION) {
                        prevClient.setStatus(ClientStatus.CONNECTED);
                        response = ResponseFactory.createResponse(HttpStatus.OK, prevClient);
                        reconnected = true;

                    } else {
                        return ResponseFactory.createResponse(HttpStatus.CONFLICT, "Nickname already in use");

                    }
                } else if (this.maxPlayers == this.dataService.getClientPool().getClients().size()) {
                    return ResponseFactory.createResponse(HttpStatus.CONFLICT, "Lobby full");
                }
                newClient.setStatus(ClientStatus.SPECTATOR);
        }

        if (!reconnected) {
            this.dataService.getClientPool().addNewClient(newClient);
            gameEngine.addPlayer(newClient.getId(), newClient.getNickname());
            response = ResponseFactory.createResponse(HttpStatus.OK, newClient);
        }

        // nauczyciel
        this.communicationService.sendMessageToLobby(this.dataService.getClientPool());

        return response;
    }

    @PostMapping("/deletePlayer")
    public ResponseEntity<String> deletePlayer(@RequestBody Client client) {
        this.dataService.getClientPool().removeClient(client);
        TaskWrapper task = new TaskWrapper(null, null, PlayerTask.DELETED);
        System.out.println("[LOG] Post-Mapping deletePlayer");
        this.communicationService.sendMessageToClient(client.getId(), task);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }
}
