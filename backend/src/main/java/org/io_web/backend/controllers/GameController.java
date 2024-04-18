package org.io_web.backend.controllers;

import org.io_web.backend.board.BoardMessage;
import org.io_web.backend.utilities.GameCodeGenerator;
import org.io_web.backend.utilities.ResponseFactory;
import org.io_web.backend.client.Client;
import org.io_web.backend.client.ClientStatus;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.client.TaskWrapper;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.game.GameStatus;
import org.io_web.backend.questions.Question;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.config.Task;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;


/**
 * Contains all methods to handle game service.
 */
@RestController
@RequestMapping("/game")
public class GameController {
    private final SharedDataService dataService;
    private final CommunicationService communicationService;

    private final GameEngine gameEngine;

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

        this.dataService.setGameCode(GameCodeGenerator.generate());
    }

    /**
     * Handles client answer during game session.
     * <p> Verifies all necessary data
     *
     * @method POST
     * @param gameCode Unique game identifier
     * @param clientID Unique user identifier
     * @return ResponseEntity wih HttpStatus and Game Data.
     * @method POST
     */
    @PostMapping("{gameCode}/client/{clientID}")
    public ResponseEntity<Object> giveAnswer(@PathVariable String gameCode, @PathVariable String clientID, @RequestBody String answer) {
        System.out.println("[GAME CONTROLLER] Answer Question");

        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");
        }
        Client client = this.dataService.getClientPool().getClientById(clientID);

        if (client == null) {
            return ResponseFactory.createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");
        }
        if (!client.getId().equals((gameEngine.getCurrentMovingPlayerId()))) {
            return ResponseFactory.createResponse(HttpStatus.FORBIDDEN, "Not your turn");
        }

        if (communicationService.isConfirmation()) {
            return ResponseFactory.createResponse(HttpStatus.ACCEPTED, true);
        }

        synchronized (this.communicationService) {
            communicationService.setConfirmation(true);
            communicationService.notifyAll();
//            return ResponseFactory.createResponse(HttpStatus.ACCEPTED, true);
        }

        if(gameEngine.getCurrentTask() == PlayerTask.ANSWERING_QUESTION){
            this.gameEngine.playerAnswered(answer);
        }

        return ResponseFactory.createResponse(HttpStatus.OK, "Success");
    }

    /**
     * Update players statuses when game status is changed.
     */
    public void gameStatusChanged(){
        if (gameEngine.getGameStatus() != GameStatus.PENDING) {
            for (Client client : this.dataService.getClientPool().getClients()) {
                if (client.getStatus() == ClientStatus.LOST_CONNECTION) {
                    this.dataService.getClientPool().removeClient(client);
                    this.gameEngine.removePlayer(client.getId());
                }
            }
        }

        if (gameEngine.getGameStatus() == GameStatus.LOBBY) {
            for (Client client : this.dataService.getClientPool().getClients()) {
                if (client.getStatus() == ClientStatus.SPECTATOR) {
                    client.setStatus(ClientStatus.SPECTATOR);
                    this.gameEngine.addPlayer(client.getId(), client.getNickname());
                }
            }
        }
    }

    /**
     * Inform Client about his turn via WebSockets
     *
     * @param diceRoll Question dice roll
     */
    public boolean informClientOfHisTurn(int diceRoll) throws InterruptedException {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        if (clientID == null){
            return false;
        }

        PlayerTask currentTask = this.gameEngine.getCurrentTask();
        TaskWrapper task =  new TaskWrapper(null, diceRoll, currentTask);

        this.communicationService.sendMessageToClient(clientID, task);
        return communicationService.waitForConfirm();
    }

    /**
     * Send question to client
     * In order to receive it, client will need to be subscribed to a websocket,
     * that is bound to their id - /client/{clientID}
     */
    public boolean sendQuestion() throws InterruptedException {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        Question currentQuestion = gameEngine.getCurrentQuestion();
        if (clientID == null || currentQuestion == null) {
            return false;
        }

        TaskWrapper task =  new TaskWrapper(currentQuestion, 0, this.gameEngine.getCurrentTask());
        System.out.println("[SENDING QUESTION]" + task + " to" + clientID) ;
        this.communicationService.sendMessageToClient(clientID, task);
        return communicationService.waitForConfirm();
    }

    public void updateTeachersView(int playerMove, boolean endingMove) {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        if (clientID == null) {
            return;
        }

        Question currentQuestion = gameEngine.getCurrentQuestion();

        BoardMessage message = new BoardMessage(clientID, playerMove, currentQuestion, endingMove);
        this.communicationService.sendMessageToBoard(message);
    }

    public final ArrayList<Question> getQuestions(){
        return dataService.getSettings().getQuestions();
    }

    @PostMapping("/endGame")
    public ResponseEntity<String> endGame(){
        gameEngine.interrupt();
        gameStatusChanged();
        BoardMessage message = new BoardMessage("", 0, null, true);
        this.communicationService.sendMessageToBoard(message);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    @PostMapping("/startGame")
    public ResponseEntity<String> startGame() {
        gameEngine.start();
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

}
