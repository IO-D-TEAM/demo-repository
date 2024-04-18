package org.io_web.backend.game;

import lombok.Getter;
import org.io_web.backend.board.Board;
import org.io_web.backend.board.Field;
import org.io_web.backend.board.Player;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.controllers.GameController;
import org.io_web.backend.questions.Question;
import org.io_web.backend.services.Settings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * In this class we should do all the logic relates to managing questions, moving players, updating board state etc.
 */

@Component
public class GameEngine extends Thread {
    @Getter
    private Board board;

    @Getter
    private GameStatus gameStatus;

    @Getter
    private Question currentQuestion = null;
    private Iterator<Question> questionIterator;
    private ArrayList<Question> questions;

    @Getter
    private PlayerTask currentTask;

    @Getter
    private ArrayList<Player> playersList = new ArrayList<>();
    private Player currentMovingPlayer = null;

    private int diceRoll = 0;
    private Iterator<Player> playerIterator;
    private final GameController controller;

    private Settings settings;


    @Autowired
    public GameEngine(GameController controller) {
        this.controller = controller;
        gameStatus = GameStatus.LOBBY;
    }

    public void loadSettings(Settings settings) {
        questions = settings.getQuestions();
        this.settings = settings;
//        System.out.println(playersList);
    }

    private void setGameStatus(GameStatus newStatus){
        gameStatus = newStatus;
        System.out.println("[ENGINE] Change game status for " + this.gameStatus);
        this.controller.gameStatusChanged();
    }


    public void addPlayer(String id, String nickname, String color) {
        if (gameStatus != GameStatus.LOBBY) {
            return;
        }
        Player newPlayer = new Player(0, 0, id, nickname, color);
        playersList.add(newPlayer);
    }

    public void removePlayer(String id) {
        playersList.removeIf(player -> !player.getId().equals(id));
    }

    // communication with server

    private boolean movePlayerOnBoard(int move){
        System.out.println("[ENGINE] Moving player " + currentMovingPlayer.getNickname() + " for " + move);
        int oldPos = currentMovingPlayer.getPosition();
        boolean gameFinished = board.movePlayer(currentMovingPlayer, move);
        int newPos = currentMovingPlayer.getPosition();
        if (gameFinished) {
            setGameStatus(GameStatus.ENDED);
        }
        this.controller.updateTeachersView(newPos - oldPos, gameFinished);
        return gameFinished;
    }

    public boolean diceRollOutcome(int dice) throws InterruptedException {
        return movePlayerOnBoard(dice);
    }

    public void playerAnswered(String answer){
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
    public void run() {
        this.board = new Board(settings.getNormalFields(), settings.getSpecialFields(), playersList);

        System.out.println("[GAME ENGINE] Starting new game " +  playersList.size());
        if (playersList.size() < 2) {
            return;
        }// informacja o niepowodzeniu
        playerIterator = playersList.iterator();

        questions = new ArrayList<>(controller.getQuestions());
        Collections.shuffle(questions);

        questionIterator = questions.iterator();
        System.out.println("[ENGINE] Setting up completed");
        setGameStatus(GameStatus.PENDING);

        controller.gameStatusChanged();
        // reset turn if ended
        System.out.println("[ENGINE] Start game " +  this.gameStatus);

        while (this.gameStatus == GameStatus.PENDING) {

            try {
                if (!playerIterator.hasNext()) {
                    playerIterator = playersList.iterator();
                }
                if (!questionIterator.hasNext()) {
                    questionIterator = questions.iterator();
                }

                currentMovingPlayer = playerIterator.next();
                currentTask = PlayerTask.THROWING_DICE;
                System.out.println("[ENGINE] New Turn player id: " + currentMovingPlayer.getId());
                Random random = new Random();
                diceRoll = random.nextInt(6) + 1;

                boolean received = controller.informClientOfHisTurn(diceRoll);
                if (!received) {
                    controller.revertClientToWait(PlayerTask.IDLE);
                    continue;
                }
                System.out.println("[ENGINE] dice rolled: " + diceRoll);

                if (diceRollOutcome(diceRoll)) {
                    break;
                }
                switch (board.getPlayerPosition().get(currentMovingPlayer)){
                    case QUESTION:
                        this.currentTask = PlayerTask.ANSWERING_QUESTION;
                        this.currentQuestion = questionIterator.next();
                        this.controller.updateTeachersView(0, false);
                        if (this.controller.sendQuestion()) {
                            System.out.println("[ENGINE] processing answer");
                            playerAnswered(controller.getPlayerAnswer());
                            sleep(2000);
                        } else {
                            currentQuestion = null;
                            controller.revertClientToWait(PlayerTask.IDLE);
                            this.controller.updateTeachersView(0, false);
                        }
                        break;
                    case SPECIAL:
                        int randomNumber = random.nextInt(2);
                        int result = (randomNumber == 0) ? -2 : 2;
                        movePlayerOnBoard(result);
                        sleep(1000);
                    default:
                        sleep(1000);
                        controller.revertClientToWait(PlayerTask.IDLE);

                }

                this.currentTask = PlayerTask.IDLE;

            } catch (InterruptedException e) {
                System.out.println("[ENGINE] ending game");
                setGameStatus(GameStatus.ENDED);
                currentMovingPlayer = null;
                currentQuestion = null;
            }

        }
        playerIterator = playersList.iterator();
        while (playerIterator.hasNext()){
            currentMovingPlayer = playerIterator.next();
            controller.revertClientToWait(PlayerTask.DELETED);
        }
    }





    public String getCurrentMovingPlayerId() {
        return (currentMovingPlayer != null) ? currentMovingPlayer.getId() : null;
    }
}
