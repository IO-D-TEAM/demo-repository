package org.io_web.backend.server;

import lombok.Getter;
import org.io_web.backend.board.Board;
import org.io_web.backend.board.Player;
import org.io_web.backend.questions.Answer;
import org.io_web.backend.questions.Question;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;

/**
 * In this class we should do all the logic relates to managing questions, moving players, updating board state etc.
 */
public class GameEngine {
    private Board board;
    @Getter
    private GameStatus gameStatus;
    private ArrayList<Player> playersList = new ArrayList<>();
    private Player currentMovingPlayer = null;
    @Getter
    private Question currentQuestion = null;
    private int diceRoll = 0;

    private Iterator<Player> playerIterator;

    private Server server;
    @Getter
    private PlayerTask currentTask;

    public GameEngine(Server server) {
        this.server = server;
        gameStatus = GameStatus.LOBBY;
    }
    private void setGameStatus(GameStatus newStatus){
        gameStatus = newStatus;
        server.gameStatusChanged();
    }

    public void addPlayer(String id) {
        if (gameStatus != GameStatus.LOBBY) {
            return;
        }
        Player newPlayer = new Player(0, 0, id);
        playersList.add(newPlayer);
    }

    public void removePlayer(String id) {
        playersList.removeIf(player -> !player.getId().equals(id));
    }

    // communication with server

    public void diceRollOutcome(int dice){
        currentMovingPlayer.move(dice);

        String[] answers = { "a", "b" };
        currentQuestion = new Question("xd?", answers, answers[0]);
        server.sendQuestion();
        currentTask = PlayerTask.ANSWERING_QUESTION;
    }

    public void playerAnswered(Answer answer){
        //TODO: handle the answer

        currentMovingPlayer = null;
        currentTask = PlayerTask.IDLE;
    }

    // game stages
    public void start() {
        if (playersList.size() < 2) {
            return;
        }// informacja o niepowodzeniu
        playerIterator = playersList.iterator();
        currentMovingPlayer = playerIterator.next();
        currentTask = PlayerTask.THROWING_DICE;

        Random random = new Random();
        diceRoll = random.nextInt(6) + 1;

        server.informClientOfHisTurn(diceRoll);
    }
    // method to change players, inform server
    public void nextTurn() {
        // reset turn if ended
        if (!playerIterator.hasNext())
            playerIterator = playersList.iterator();

        currentMovingPlayer = playerIterator.next();
        currentTask = PlayerTask.THROWING_DICE;

        Random random = new Random();
        diceRoll = random.nextInt(6) + 1;

        server.informClientOfHisTurn(diceRoll);
    }

    public String getCurrentMovingPlayerId() {
        return (currentMovingPlayer != null) ? currentMovingPlayer.getId() : null;
    }
}
