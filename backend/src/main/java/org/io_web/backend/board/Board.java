package org.io_web.backend.board;

import org.io_web.backend.questions.Question;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Represents state of the board.
 */
public class Board {
    private final int sizeOfBoard;
    private final int specialFields;
    private ArrayList<Field> path;
    private Set<Question> setOfQuestions;
    private Map<Player, Field> playerPosition;

    public Board(int sizeOfBoard, int specialFields, List<Player> players) {
        this.sizeOfBoard = sizeOfBoard;
        this.specialFields = specialFields;
        this.path = new ArrayList<>();
        this.setOfQuestions = new HashSet<>();
        for (int i=0; i<sizeOfBoard; i++) {
            Field newField = new Field(false);
            path.add(newField);
        }
        players.forEach(obj -> playerPosition.put(obj, path.getFirst()));
    }

    public void addQuestion(Question... questions) {
        setOfQuestions.addAll(Arrays.asList(questions));
    }

    public void movePlayer(Player player, int steps) {
        if (sizeOfBoard == player.getPosition()) {
            System.out.println("END");
        }
        player.move(steps);
        playerPosition.put(player, path.get(player.getPosition()));
    }
}
