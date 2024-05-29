package org.io_web.backend.services;

import java.util.ArrayList;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.board.BoardMessage;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.client.TaskWrapper;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.game.GameStatus;
import org.io_web.backend.game_events.GameStatusChangedEvent;
import org.io_web.backend.game_events.SendQuestionEvent;
import org.io_web.backend.game_events.UpdateBoardViewEvent;
import org.io_web.backend.models.Question;
import org.io_web.backend.utilities.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

/**
 * Game Service contains all necessary logic to handle game events and logic.
 */
@Service
public class GameService {
    private final SharedDataService dataService;
    private final CommunicationService communicationService;
    private final GameEngine gameEngine;

    private final Logger LOGGER = LogManager.getLogger(GameService.class);

    @Autowired
    public GameService(SharedDataService dataService, CommunicationService communicationService, @Lazy GameEngine gameEngine) {
        this.dataService = dataService;
        this.communicationService = communicationService;
        this.gameEngine = gameEngine;
    }

    /**
     * Process answer will contain all necessary functionalities to
     * handle game answering logic.
     *
     * @param gameCode unique identifier of game
     * @param clientID unique identifier of client
     * @param answer   client answer
     */
    public void processAnswer(String gameCode, String clientID, String answer) {
        LOGGER.info("Processing answer for clientID: {} for game: {}", clientID, gameCode);

        validateGameAndPlayer(gameCode, clientID);

        if (communicationService.isConfirmation()) {
            LOGGER.info("Returning confirmation status for clientID: {}", clientID);
            return;
        }

        switch (gameEngine.getCurrentTask()) {
            case ANSWERING_QUESTION:
                handleAnsweringQuestion(clientID, answer);
                break;
            case THROWING_DICE:
                gameEngine.confirmResponseReceived();
                break;
        }

        synchronizeAndNotifyCommunicationService();
    }

    /**
     * Update players on game change.
     */
    @EventListener
    public void handleGameStatusChangedEvent(GameStatusChangedEvent event) {
        LOGGER.info("Informing clients on game status change");
        GameStatus currentStatus = event.getNewStatus();

        // Remove clients with lost connection if the game is not pending
        if (currentStatus != GameStatus.PENDING) {
            dataService.removeDisconnected();
        }
    }

    @EventListener
    public void handleUpdateBoardViewEvent(UpdateBoardViewEvent event) {
        LOGGER.info("Updating view");
        String clientID = gameEngine.getCurrentMovingPlayerId();
        ValidationUtils.validateNextMovingPlayer(clientID);

        int playerMove = event.getMove();
        boolean endingMove = event.isEndingMove();
        Question currentQuestion = gameEngine.getCurrentQuestion();
        BoardMessage message = new BoardMessage(clientID, playerMove, currentQuestion, endingMove);

        this.communicationService.sendMessageToBoard(message);
    }

    @EventListener
    public void handleSendQuestionEvent(SendQuestionEvent event) {
        sendQuestion();
    }

    /**
     * Inform Client about his turn using WebSockets
     *
     * @param diceRoll Question dice roll
     */
    public boolean informClientOfHisTurn(int diceRoll) throws InterruptedException {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        if (clientID == null) {
            return false;
        }

        PlayerTask currentTask = this.gameEngine.getCurrentTask();
        TaskWrapper task = new TaskWrapper(null, diceRoll, currentTask);
//		playerAnswer = "";
        this.communicationService.sendMessageToClient(clientID, task);
        return communicationService.waitForConfirm(dataService.getSettings().getTimeForAnswer());
    }

    /**
     * Send question to client
     * In order to receive it, client will need to be subscribed to a websocket,
     * that is bound to their id - /client/{clientID}
     */
    public void sendQuestion() {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        Question currentQuestion = gameEngine.getCurrentQuestion();

        TaskWrapper task = new TaskWrapper(currentQuestion, 0, this.gameEngine.getCurrentTask());
        LOGGER.info("[SENDING QUESTION]{} to{}", task, clientID);
        this.communicationService.sendMessageToClient(clientID, task);
    }

    public void revertClientToWait(PlayerTask playerTask) {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        TaskWrapper task = new TaskWrapper(null, null, playerTask);
        this.communicationService.sendMessageToClient(clientID, task);
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

    public final ArrayList<Question> getQuestions() {
        return dataService.getSettings().getQuestions();
    }

    public void endGame() {
        gameEngine.stop();
        BoardMessage message = new BoardMessage("", 0, null, true);
        this.communicationService.sendMessageToBoard(message);
    }

    public void startGame() {
        try {
            gameEngine.addPlayers(dataService.getClients());
            gameEngine.loadSettings(dataService.getSettings());
            gameEngine.initialize();
            gameEngine.startGame();
        } catch (InterruptedException e) {
            LOGGER.error(e.getMessage());
            throw new RuntimeException(e);
        }

    }

    private void synchronizeAndNotifyCommunicationService() {
        synchronized (this.communicationService) {
            communicationService.setConfirmation(true);
            communicationService.notifyAll();
        }
    }

    private void handleAnsweringQuestion(String clientID, String answer) {
        gameEngine.setPlayerAnswer(clientID, answer);
        gameEngine.confirmResponseReceived();
    }

    private void validateGameAndPlayer(String gameCode, String clientID) {
        ValidationUtils.validateGame(gameCode, dataService.getGameCode());
        ValidationUtils.validateNotNull(dataService.getClient(clientID));
        ValidationUtils.validatePlayerTurn(clientID, gameEngine.getCurrentMovingPlayerId());
    }

}
