package board;

import questions.Question;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

/**
 * Represents state of the board.
 */
public class Board {
    private int sizeOfBoard;
    private ArrayList<Field> path;
    private Set<Question> setOfQuestions;
    private Map<Player, Field> playerPosition;

    public void movePlayer(Player player, int steps) {
        if (sizeOfBoard == player.getPosition()) {
            System.out.println("END");
        }
        player.move(steps);
        playerPosition.put(player, path.get(player.getPosition()));
    }
}
