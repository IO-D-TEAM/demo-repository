package org.io_web.backend.board;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents state of the board.
 */
public class Board {
    private final int sizeOfBoard;
    private final int specialFields;
    @Getter
    private ArrayList<Field> path;
    private Map<Player, Field> playerPosition;

    public Board(int sizeOfBoard, int specialFields, List<Player> players) {
        if (sizeOfBoard == 0) {
            sizeOfBoard = 1;
        }
        this.sizeOfBoard = sizeOfBoard;
        this.specialFields = specialFields;
        this.path = new ArrayList<>(Collections.nCopies(sizeOfBoard, Field.NORMAL));
        this.playerPosition = new HashMap<>();

        // first and last fields must be normal
        // fields with odd indexes will be of question type
        // indexes of all other fields will go into a pool,
        // from which special fields will be selected
        ArrayList<Integer> fieldIndexPool = new ArrayList<>();
        for (int i = 1; i < sizeOfBoard - 1; ++i) {
            if (i % 2 == 1) {
                path.set(i, Field.QUESTION);
            }
            else {
                fieldIndexPool.add(i);
            }
        }

        // assuming correct special field quantity,
        // randomize board indexes to place them on and shrink fieldIndexPool to correct size
        // otherwise every single field with index inside fieldPoolIndex will be special
        if (specialFields < fieldIndexPool.size()) {
            Collections.shuffle(fieldIndexPool);
            fieldIndexPool.subList(specialFields, fieldIndexPool.size()).clear();
        }

        fieldIndexPool.forEach(i -> path.set(i, Field.SPECIAL));
        players.forEach(obj -> playerPosition.put(obj, path.getFirst()));
    }

    public Field getField(int position) {
        return this.path.get(position);
    }
    /**
     * Move player on the board, with bound checking
     * @param player which player to move
     * @param steps how far to move (can be negative)
     * @return true if game has ended, else false
     */
    public boolean movePlayer(Player player, int steps) {
        boolean gameEnded = false;
        int currPos = player.getPosition();

        if (currPos + steps >= sizeOfBoard) {
            // calculate steps needed to achieve finish field
            steps = currPos + steps - (sizeOfBoard + 1);
            gameEnded = true;
        }
        player.move(steps);
        playerPosition.put(player, path.get(player.getPosition()));
        return gameEnded;
    }
}
