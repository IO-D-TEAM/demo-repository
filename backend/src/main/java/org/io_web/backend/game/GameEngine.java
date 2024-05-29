package org.io_web.backend.game;

import java.util.*;
import java.util.concurrent.*;

import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.entities.Client;
import org.io_web.backend.game_events.GameStatusChangedEvent;
import org.io_web.backend.game_events.InformPlayerOfHisTurnEvent;
import org.io_web.backend.game_events.SendQuestionEvent;
import org.io_web.backend.game_events.UpdateBoardViewEvent;
import org.io_web.backend.itarators.ResettingIterator;
import org.io_web.backend.models.Board;
import org.io_web.backend.models.Player;
import org.io_web.backend.models.Question;
import org.io_web.backend.models.Settings;
import org.io_web.backend.payload.BoardConfigurationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;


/**
 * In this class we should do all the logic relates to managing questions, moving players, updating board state etc.
 */
@Component
public class GameEngine implements Runnable {
    private final Logger LOGGER = LogManager.getLogger(GameEngine.class);

    private final ApplicationEventPublisher eventPublisher;
    private CompletableFuture<Boolean> confirmationFuture;
    private Board board = null;
    private Player currentMovingPlayer = null;
    private boolean running = true;
    private String answer = "";
    private ArrayList<Question> questions;

    @Setter
    @Getter
    private HashSet<Player> playerList = new HashSet<>();

    @Setter
    private Settings settings = null;

    @Getter
    private GameStatus gameStatus;

    @Getter
    private Question currentQuestion = null;

    @Getter
    private PlayerTask currentTask;


    @Autowired
    public GameEngine(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
        this.gameStatus = GameStatus.LOBBY;
    }

    @Override
    public void run() {
        initialize();

        while (running) {
            try {
                startGame();
            } catch (InterruptedException e) {
                LOGGER.info("[ENGINE] Game interrupted");
                Thread.currentThread().interrupt(); // Restore the interrupted status
                stop();
            }
        }
    }

    public void initialize() {
        LOGGER.info("Initializing game engine");
        this.questions = settings.getQuestions();
        this.board = new Board(settings.getNormalFields(), settings.getSpecialFields(), new ArrayList<>(playerList));
    }

    public void loadSettings(Settings settings) {
        LOGGER.info("Loading game settings");
        questions = settings.getQuestions();
        this.settings = settings;
    }

    private void setGameStatus(GameStatus newStatus) {
        LOGGER.info("Change game status, new status: {}", this.gameStatus);
        gameStatus = newStatus;
        eventPublisher.publishEvent(new GameStatusChangedEvent(this, newStatus));
    }

    public void addPlayers(ArrayList<Client> clients) {
        for (Client client : clients) {
            LOGGER.info("Adding new player to game, id: {}, name: {}, color: {}", client.getId(), client.getNickname(), client.getColor());
            Player newPlayer = new Player(0, client.getId(), client.getNickname(), client.getColor());
            playerList.add(newPlayer);
        }
    }

    public void removePlayer(String id) {
        playerList.removeIf(player -> !player.getId().equals(id));
    }

    // communication with server
    private boolean movePlayerOnBoard(int move) {
        int oldPos = currentMovingPlayer.getPosition();
        boolean gameFinished = board.movePlayer(currentMovingPlayer, move);
        int newPos = currentMovingPlayer.getPosition();

        if (gameFinished) {
            setGameStatus(GameStatus.ENDED);
        }

        LOGGER.info("Moving current player to new position: {} -> {}, finish status: {}", oldPos, newPos, gameFinished);

        this.eventPublisher.publishEvent(new UpdateBoardViewEvent(this, newPos - oldPos, gameFinished));
        return gameFinished;
    }

    public boolean diceRollOutcome(int dice) {
        return movePlayerOnBoard(dice);
    }

    public Board getBoard() {
        if (settings == null) {
            settings = new Settings();
        }

        return Objects.requireNonNullElseGet(this.board,
                () -> new Board(settings.getNormalFields(), settings.getSpecialFields(), new ArrayList<>(playerList)));
    }

    public void playerAnswered(String answer) {
        int playerMove = 0;
        if (currentQuestion.isCorrect(answer)) {
            currentMovingPlayer.addPoints(1);
            playerMove = 1;
        }
        currentQuestion = null;
        movePlayerOnBoard(playerMove);
        currentTask = PlayerTask.IDLE;
    }

    // game stages
    // method to change players, inform server
    public void startGame() throws InterruptedException {
        this.board = new Board(settings.getNormalFields(), settings.getSpecialFields(), new ArrayList<>(playerList));

        if (playerList.size() < 2) {
            LOGGER.error("Players list less than 2!");
            return;
        }

        Collections.shuffle(questions);

        ResettingIterator<Player> playerIterator = new ResettingIterator<>(new ArrayList<>(playerList));
        ResettingIterator<Question> questionIterator = new ResettingIterator<>(questions);

        LOGGER.info("Setting up completed. Starting new game!");
        LOGGER.info("Game settings: {}", settings);
        setGameStatus(GameStatus.PENDING);

        while (this.gameStatus == GameStatus.PENDING && !Thread.currentThread().isInterrupted()) {
            if (playerIterator.hasNext()) {
                currentMovingPlayer = playerIterator.next();
            }

            currentTask = PlayerTask.THROWING_DICE;
            LOGGER.info("[ENGINE] New Turn player id: {}", currentMovingPlayer.getId());

            Random random = new Random();
            int diceRoll = random.nextInt(6) + 1;

            this.eventPublisher.publishEvent(new InformPlayerOfHisTurnEvent(this, diceRoll));
            waitForAnswer();
            LOGGER.info("[ENGINE] dice rolled: {}", diceRoll);

            if (diceRollOutcome(diceRoll)) {
                break;
            }

            switch (board.getPlayerPosition().get(currentMovingPlayer)) {
                case QUESTION:
                    this.currentTask = PlayerTask.ANSWERING_QUESTION;

                    if (questionIterator.hasNext()) {
                        this.currentQuestion = questionIterator.next();
                    }

                    this.movePlayerOnBoard(0);
                    this.eventPublisher.publishEvent(new SendQuestionEvent(this));
                    waitForAnswer();
                    playerAnswered(answer);
                    break;
                case SPECIAL:
                    int randomNumber = random.nextInt(2);
                    int result = (randomNumber == 0) ? -2 : 2;
                    movePlayerOnBoard(result);
                default:

            }

            this.currentTask = PlayerTask.IDLE;
        }

        while (playerIterator.hasNext()) {
            currentMovingPlayer = playerIterator.next();
        }
    }

    public String getCurrentMovingPlayerId() {
        return (currentMovingPlayer != null) ? currentMovingPlayer.getId() : null;
    }

    public boolean waitForConfirm(int timeoutSeconds) {
        confirmationFuture = new CompletableFuture<>();

        try {
            return confirmationFuture.get(timeoutSeconds, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            return false;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    public void confirmResponseReceived() {
        // Method to be called when the client's response is received
        if (confirmationFuture != null) {
            confirmationFuture.complete(true);
        }
    }

    public void waitForAnswer() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Boolean> future = executor.submit(() -> waitForConfirm(5));

        try {
            if (future.get(settings.getTimeForAnswer(), TimeUnit.SECONDS)) {
                LOGGER.info("Client answered within 5 seconds.");
            }
        } catch (TimeoutException e) {
            LOGGER.info("Timeout reached, client did not answer.");
        } catch (Exception e) {
            LOGGER.error("[ENGINE] Error while waiting for client answer.", e);
        } finally {
            executor.shutdown();
        }
    }

    public void failResponseReceived() {
        if (confirmationFuture != null) {
            confirmationFuture.complete(false);
        }
    }

    public void setPlayerAnswer(String clientID, String answer) {
        this.answer = answer;
    }

    public void stop() {
        this.running = false;
        this.gameStatus = GameStatus.ENDED;
    }

    public BoardConfigurationResponse getBoardConfig() {

        board = new Board(30, 20, new ArrayList<>(playerList));

        return new BoardConfigurationResponse(
                0,
                board.getPath().size(),
                board.getPath(),
                playerList
        );
    }


}
