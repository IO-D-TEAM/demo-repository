package org.io_web.backend.controllers;

import org.io_web.backend.utilities.NetworkUtils;
import org.io_web.backend.utilities.ResponseFactory;
import org.io_web.backend.client.Client;
import org.io_web.backend.client.ClientStatus;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.client.TaskWrapper;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.game.GameStatus;
import org.io_web.backend.questions.Answer;
import org.io_web.backend.questions.Question;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Random;

/**
 * Contains all methods to handle game service.
 */
@RestController
@RequestMapping("/game")
public class GameController {
    private final SharedDataService dataService;
    private final CommunicationService communicationService;

    private final GameEngine gameEngine;
    private final int maxPlayers = 20;

    /**
     * Launches controller with Spring's dependency injection mechanism,
     * and generate & set new Game Code
     *
     * @param communicationService - WebSocket communication service
     * @param sharedDataService - Service for data exchange between controllers
     * @param gameEngine - Game Engine (Lazy initialize to break the cycle)
     */
    @Autowired
    public GameController(CommunicationService communicationService, SharedDataService sharedDataService, @Lazy GameEngine gameEngine) {
        this.communicationService = communicationService;
        this.dataService = sharedDataService;
        this.gameEngine = gameEngine;

        this.dataService.setGameCode(generateGameCode());
    }


    /**
     * Returns generated game code
     *
     * @return - Generated code
     */
    public static String generateGameCode() {
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder();

        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int CODE_LENGTH = 6;

        for (int i = 0; i < CODE_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            stringBuilder.append(CHARACTERS.charAt(randomIndex));
        }

        return stringBuilder.toString();
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
        if (!gameCode.equals(this.dataService.getGameCode()))
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");

        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Returns valid join game link
     *
     * @method GET
     * @return ResponseEntity with valid link or error message
     *
     * <p>>Method is iterating over all network interfaces in computer.
     * Then it iterate over all NI's addresses. If one address is in correct form
     * could be valid address we test it with api call.
     */
    @GetMapping({"get_url"})
    public ResponseEntity<String> getGameUrl(){
        String joinGameUrl = NetworkUtils.createUrl(this.dataService.getGameCode());

        if(joinGameUrl != null)
            return ResponseFactory.createResponse(HttpStatus.OK, joinGameUrl);

        return ResponseFactory.createResponse(HttpStatus.SERVICE_UNAVAILABLE, "Message unavailable!");
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

        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }

        boolean reconnected = false;
        ResponseEntity<Object> response = null;

        switch (gameEngine.getGameStatus()) {
            case LOBBY, ENDED:
                if (this.dataService.getClientPool().isClientPresent(newClient.getNickname()))
                    return ResponseFactory.createResponse(HttpStatus.CONFLICT, "Nickname already in use");
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
                } else if (this.maxPlayers == this.dataService.getClientPool().getClients().size() ) {
                    return ResponseFactory.createResponse(HttpStatus.CONFLICT, "Lobby full");
                }
                newClient.setStatus(ClientStatus.SPECTATOR);

        }

        if (!reconnected) {
            this.dataService.getClientPool().addNewClient(newClient);
            gameEngine.addPlayer(newClient.getId());
            response = ResponseFactory.createResponse(HttpStatus.OK, newClient);
        }

        // nauczyciel
        this.communicationService.sendMessageToLobby(this.dataService.getClientPool());

        return response;
    }


    /**
     * Handles situation when client is observing the game. Provide user with information
     * about questions, dice throwing etc.
     *
     * @param gameCode Unique game identifier
     * @param clientID Unique user identifier
     * @return ResponseEntity wih HttpStatus and Game Data.
     */
    @GetMapping("{gameCode}/{clientID}")
    public ResponseEntity<Object> attendGame(@PathVariable String gameCode, @PathVariable String clientID) {

        if (!gameCode.equals(this.dataService.getGameCode()))
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");

        Client client = this.dataService.getClientPool().getClientById(clientID);

        if (client == null)
            return ResponseFactory.createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");

        return ResponseFactory.createResponse(HttpStatus.OK, client);
    }

    /**
     * Returns Game Code
     *
     * @method GET
     * @return ResponseEntity wih HttpStatus and Game Data.
     */
    @GetMapping("/gamecode")
    public String showGeneratedCode() {
        return this.dataService.getGameCode();
    }

    /**
     * Handles client answer during game session.
     * <p> Verifies all necessary data
     *
     * @method POST
     * @param gameCode Unique game identifier
     * @param clientID Unique user identifier
     * @param answer Class representing Client Answer
     * @return ResponseEntity wih HttpStatus and Game Data.
     */
    @PostMapping("{gameCode}/{clientID}")
    public ResponseEntity<Object> giveAnswer(@PathVariable String gameCode, @PathVariable String clientID, @RequestBody Answer answer) {

        if (!gameCode.equals(this.dataService.getGameCode()))
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");

        Client client = this.dataService.getClientPool().getClientById(clientID);

        if (client == null)
            return ResponseFactory.createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");

        if (!client.getId().equals((gameEngine.getCurrentMovingPlayerId())))
            return ResponseFactory.createResponse(HttpStatus.FORBIDDEN, "Not your turn");

        this.gameEngine.playerAnswered(answer);
        return ResponseFactory.createResponse(HttpStatus.ACCEPTED, client);
    }

    /**
     * Update players statuses when game status is changed.
     */
    public void gameStatusChanged(){
        if (gameEngine.getGameStatus() != GameStatus.PENDING) {
            for(Client client : this.dataService.getClientPool().getClients()){
                if(client.getStatus() == ClientStatus.LOST_CONNECTION ) {
                    this.dataService.getClientPool().removeClient(client);
                    this.gameEngine.removePlayer(client.getId());
                }
            }
        }

        if (gameEngine.getGameStatus() == GameStatus.LOBBY) {
            for(Client client : this.dataService.getClientPool().getClients()){
                if(client.getStatus() == ClientStatus.SPECTATOR ) {
                    client.setStatus(ClientStatus.SPECTATOR);
                    this.gameEngine.addPlayer(client.getId());
                }
            }
        }
    }

    /**
     * Inform Client about his turn via WebSockets
     *
     * @param diceRoll Question dice roll
     */
    public void informClientOfHisTurn(int diceRoll) {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        if (clientID == null) return;

        PlayerTask currentTask = this.gameEngine.getCurrentTask();
        TaskWrapper task =  new TaskWrapper(null, diceRoll, currentTask);

        this.communicationService.sendMessageToClient(clientID, task);
    }

    /**
     * Send question to client
     * In order to receive it, client will need to be subscribed to a websocket,
     * that is bound to their id - /client/{clientID}
     */
    public void sendQuestion() {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        Question currentQuestion = gameEngine.getCurrentQuestion();
        if (clientID == null || currentQuestion == null) return;

        TaskWrapper task =  new TaskWrapper(currentQuestion, 0, PlayerTask.ANSWERING_QUESTION);
        this.communicationService.sendMessageToClient(clientID, task);
    }

    public final ArrayList<Question> getQuestions(){
        return dataService.getSettings().getQuestions();
    }

}
