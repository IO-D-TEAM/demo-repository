package org.io_web.backend.game;

import lombok.Getter;
import org.io_web.backend.board.Board;
import org.io_web.backend.board.Player;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.controllers.GameController;
import org.io_web.backend.questions.Question;
import org.io_web.backend.services.Settings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.Random;

/**
 * In this class we should do all the logic relates to managing questions, moving players, updating board state etc.
 */

@Component
public class GameEngine extends Thread{
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



    @Autowired
    public GameEngine(GameController controller) {
        this.controller = controller;
        this.board = new Board(12, 4, playersList); // placeholder
        gameStatus = GameStatus.LOBBY;
    }

    private void setGameStatus(GameStatus newStatus){
        gameStatus = newStatus;
        this.controller.gameStatusChanged();
    }


    public void addPlayer(String id, String nickname) {
        if (gameStatus != GameStatus.LOBBY) {
            return;
        }
        Player newPlayer = new Player(0, 0, id, nickname);
        playersList.add(newPlayer);
    }

    public void removePlayer(String id) {
        playersList.removeIf(player -> !player.getId().equals(id));
    }

    // communication with server

    public boolean diceRollOutcome(int dice) {
        int oldPos = currentMovingPlayer.getPosition();
        boolean gameFinished = board.movePlayer(currentMovingPlayer, dice);
        int newPos = currentMovingPlayer.getPosition();

        if (gameFinished) {
            setGameStatus(GameStatus.ENDED);
            return true;
        }
        currentQuestion = questionIterator.next();
        this.controller.sendQuestion();

        this.controller.updateTeachersView(newPos - oldPos, gameFinished);
        return false;
    }

    public void playerAnswered(String answer){
        if (currentQuestion.isCorrect(answer)) {
            controller.updateTeachersView(1);
            currentMovingPlayer.addPoints(1);
            if (board.movePlayer(currentMovingPlayer, 1) ) {
                setGameStatus(GameStatus.ENDED);
            }
        }

        nextTurn();
        currentTask = PlayerTask.IDLE;
    }

    // game stages

    // method to change players, inform server
    public void run() {
        if (playersList.size() < 2) {
            return;
        }// informacja o niepowodzeniu
        playerIterator = playersList.iterator();

        questions = new ArrayList<>(controller.getQuestions());
        Collections.shuffle(questions);

        questionIterator = questions.iterator();
        System.out.println("[ENGINE] Setting up completed");
        this.gameStatus = GameStatus.PENDING;

        controller.gameStatusChanged();
        // reset turn if ended
        System.out.println("[ENGINE] Start game");

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
                if (!received) continue;
                System.out.println("[ENGINE] dice rolled: " + diceRoll);
                if (diceRollOutcome(diceRoll))
                    break;

            } catch (InterruptedException e) {
                System.out.println("[ENGINE] ending game");
                this.gameStatus = GameStatus.ENDED;
                currentMovingPlayer = null;
                currentTask = PlayerTask.IDLE;
                currentQuestion = null;
            }
        }

    }

    public String getCurrentMovingPlayerId() {
        return (currentMovingPlayer != null) ? currentMovingPlayer.getId() : null;
    }
}
