package org.io_web.backend.server;

import lombok.Getter;
import org.io_web.backend.board.Board;
import org.io_web.backend.board.Player;
import org.io_web.backend.questions.Answer;
import org.io_web.backend.questions.Question;

import java.util.ArrayList;
import java.util.Iterator;

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

    private Iterator<Player> playerIterator;

    private Server server;
    @Getter
    private PlayerTask currentTask;

    public GameEngine() {
        gameStatus = GameStatus.LOBBY;
    }
    private void setGameStatus(GameStatus newStatus){
        gameStatus = newStatus;
        server.gameStatusChanged();
    }

    public void addPlayer(String id) {
        if (gameStatus != GameStatus.LOBBY) return;
        Player newPlayer = new Player(0, 0, id);
        playersList.add(newPlayer);
    }

    public void removePlayer(String id) {
        for (Player player : playersList)
            if (player.getId().equals(id)) {
                playersList.remove(player);
                break;
            }
    }

    // communication with server

    public void diceRollOutcome(int dice){
        currentMovingPlayer.move(dice);

        currentTask = PlayerTask.ANSWERING_QUESTION;
    }

    public void playerAnswered(Answer answer){


        currentMovingPlayer = null;
        currentTask = PlayerTask.IDLE;
    }

    // game stages
    public void start() {
        if (playersList.size() < 2) return; // informacja o niepowodzeniu
        playerIterator = playersList.iterator();
        currentMovingPlayer = playerIterator.next();
        currentTask = PlayerTask.THROWING_DICE;
        server.informClientOfHisTurn();
    }
    // method to change players, inform server
    public void nextTurn() {

    }

    ;

    public String getCurrentMovingPlayerId() {
        if (currentMovingPlayer != null) return currentMovingPlayer.getId();
        return null;
    }


}
