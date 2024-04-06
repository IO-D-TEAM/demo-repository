package org.io_web.backend.controllers;

import org.io_web.backend.Utilities.ResponseFactory;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/game")
public class GameController {
    private final SharedDataService dataService;
    private final CommunicationService communicationService;

    private final GameEngine gameEngine;
    private final int maxPlayers = 10;

    @Autowired
    public GameController(CommunicationService communicationService, SharedDataService sharedDataService) {
        this.communicationService = communicationService;
        this.dataService = sharedDataService;

        this.dataService.setGameCode(generateGameCode());
        this.gameEngine = new GameEngine(this);
    }

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
     * GET: Return OK if game with ID exists
     */
    @GetMapping("{gameCode}/join_game")
    public ResponseEntity<String> mainPage(@PathVariable String gameCode) {
        if (!gameCode.equals(this.dataService.getGameCode()))
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");

        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Handle new user joining game.
     * <p>
     * Method: POST
     * @param newClient The Class representing client
     */
    @PostMapping("{gameCode}/join_game")
    public ResponseEntity joinGame(@PathVariable String gameCode, @RequestBody Client newClient) {

        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }

        boolean reconnected = false;
        ResponseEntity response = null;

        switch (gameEngine.getGameStatus()) {
            case LOBBY, ENDED:
                if (this.dataService.isClientPresent(newClient.getNickname()))
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
            this.dataService.addNewClient(newClient);
            gameEngine.addPlayer(newClient.getId());
            response = ResponseFactory.createResponse(HttpStatus.OK, newClient);
        }

        // nauczyciel
        communicationService.sendMessageToLobby(this.dataService.getClientPool());
        return response;
    }

    // client observes game, getting information about throwing, questions
    @GetMapping("{gameCode}/{clientID}")
    public ResponseEntity attendGame(@PathVariable String gameCode, @PathVariable String clientID) {
        if (!gameCode.equals(this.dataService.getGameCode()))
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");

        Client client = this.dataService.getClientPool().getClientById(clientID);

        if (client == null)
            return ResponseFactory.createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");

        return ResponseFactory.createResponse(HttpStatus.OK, client);
    }

    @GetMapping("/gamecode")
    public String showGeneratedCode() {
        return this.dataService.getGameCode();
    }


    // client sends his answer
    @PostMapping("{gameCode}/{clientID}")
    public ResponseEntity giveAnswer(@PathVariable String gameCode, @PathVariable String clientID, @RequestBody Answer answer) {
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

    public void gameStatusChanged(){
        if (gameEngine.getGameStatus() != GameStatus.PENDING) {
            for(Client client : this.dataService.getClientPool().getClients()){
                if(client.getStatus() == ClientStatus.LOST_CONNECTION ) {
                    this.dataService.removeClient(client);
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

    public void informClientOfHisTurn(int diceRoll) {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        if (clientID == null) return;

        PlayerTask currentTask = this.gameEngine.getCurrentTask();
        TaskWrapper task =  new TaskWrapper(null, null, PlayerTask.ANSWERING_QUESTION);

        this.communicationService.sendMessageToClient(clientID, task.serialize());
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
        this.communicationService.sendMessageToClient(clientID, task.serialize());
    }
}
