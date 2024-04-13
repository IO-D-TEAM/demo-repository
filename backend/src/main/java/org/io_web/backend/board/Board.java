package org.io_web.backend.board;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Represents state of the board.
 */
public class Board {
    private final int sizeOfBoard;
    private final int specialFields;
    private ArrayList<Field> path;
    private Map<Player, Field> playerPosition;

    public Board(int sizeOfBoard, int specialFields, List<Player> players) {
        this.sizeOfBoard = sizeOfBoard;
        this.specialFields = specialFields;
        this.path = new ArrayList<>();
        for (int i=0; i<sizeOfBoard; i++) {
            Field newField = new Field(false);
            path.add(newField);
        }
        players.forEach(obj -> playerPosition.put(obj, path.get(0)));
    }


    public void movePlayer(Player player, int steps) {
        if (sizeOfBoard == player.getPosition()) {
            System.out.println("END");
        }
        player.move(steps);
        playerPosition.put(player, path.get(player.getPosition()));
    }
}
