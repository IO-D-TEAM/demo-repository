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
public class GameEngine {
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
    private GameController controller;

    @Autowired
    public GameEngine(GameController controller) {
        this.controller = controller;
        gameStatus = GameStatus.LOBBY;
    }

    public void loadSettings(Settings settings) {
        gameStatus = GameStatus.PENDING;

        this.board = new Board(settings.getNormalFields(), settings.getSpecialFields(), playersList);

//        questions = controller.getDataService().getSettings().chujWie()
        String[] q = {"a", "b", "odp1"};
        questions = new ArrayList<>();
        questions.add(new Question("pytanie1", q, "odp1"));
        questions.add(new Question("pytanie2", q, "odp1"));
        questions.add(new Question("pytanie3", q, "odp1"));

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

    public void diceRollOutcome(int dice) {
        int oldPos = currentMovingPlayer.getPosition();
        boolean gameFinished = board.movePlayer(currentMovingPlayer, dice);
        int newPos = currentMovingPlayer.getPosition();

        if (gameFinished) {
            setGameStatus(GameStatus.ENDED);
        }

        String[] answers = { "a", "b" };
        currentQuestion = new Question("xd?", answers, answers[0]);
        currentTask = PlayerTask.ANSWERING_QUESTION;
        this.controller.sendQuestion();
        this.controller.updateTeachersView(newPos - oldPos);
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
    public void start() {
        if (playersList.size() < 2) {
            return;
        }// informacja o niepowodzeniu
        playerIterator = playersList.iterator();

//        questions = new ArrayList<>(controller.getQuestions());
        Collections.shuffle(questions);

        questionIterator = questions.iterator();
        nextTurn();
    }

    // method to change players, inform server
    public void nextTurn() {
        // reset turn if ended
        if (!playerIterator.hasNext()) {
            playerIterator = playersList.iterator();
        }
        if (!questionIterator.hasNext()) {
            questionIterator = questions.iterator();
        }

        currentMovingPlayer = playerIterator.next();
        currentTask = PlayerTask.THROWING_DICE;

        Random random = new Random();
        diceRoll = random.nextInt(6) + 1;

        this.controller.informClientOfHisTurn(diceRoll);
    }

    public String getCurrentMovingPlayerId() {
        return (currentMovingPlayer != null) ? currentMovingPlayer.getId() : null;
    }
}
