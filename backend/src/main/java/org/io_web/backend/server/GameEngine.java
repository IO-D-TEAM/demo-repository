package org.io_web.backend.server;

import lombok.Getter;
import org.io_web.backend.board.Board;
import org.io_web.backend.board.Player;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

/**
 * In this class we should do all the logic relates to managing questions, moving players, updating board state etc.
 */
public class GameEngine {
    private Board board;
    @Getter
    private GameStatus gameStatus;
    private ArrayList<Player> playersList;
    private Player currentMovingPlayer = null;
    @Getter
    private String currentQuestion = null;

    @Getter
    private ArrayList<String> currentAnswers;

    public GameEngine(){
        gameStatus = GameStatus.LOBBY;
    }

    public void addPlayer(int id){
        if (gameStatus != GameStatus.LOBBY) return;
        Player newPlayer = new Player(0, 0, id);
        playersList.add(newPlayer);
    }
    public void nextTurn(){};

    public int getCurrentMovingPlayerId(){ return currentMovingPlayer.getId();}


}
