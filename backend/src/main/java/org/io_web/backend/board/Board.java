package org.io_web.backend.board;

import org.io_web.backend.questions.Question;

import java.util.*;

/**
 * Represents state of the board.
 */
public class Board {
    private final int sizeOfBoard;
    private final int specialFields;
    private ArrayList<Field> path;
    private ArrayList<Question> questions;
    private int currQuestionIndex = 0;
    private Map<Player, Field> playerPosition;

    public Board(int sizeOfBoard, int specialFields, List<Player> players) {
        this.sizeOfBoard = sizeOfBoard;
        this.specialFields = specialFields;
        this.path = new ArrayList<>(Collections.nCopies(sizeOfBoard, Field.NORMAL));
        this.questions = new ArrayList<>();
        this.playerPosition = new HashMap<>();

        // first and last fields must be normal
        // fields with odd indexes will be of question type
        ArrayList<Integer> fieldIndexPool = new ArrayList<>();
        for (int i = 1; i < sizeOfBoard - 1; ++i) {
            if (i % 2 == 1) path.set(i, Field.QUESTION);
            else fieldIndexPool.add(i);
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

    public void addQuestions(Question... questions) {
        this.questions.addAll(Arrays.asList(questions));
        Collections.shuffle(this.questions);
    }

    public Question getQuestion(int playerPosition) {
        Field playerField = path.get(playerPosition);
        if (!playerField.equals(Field.QUESTION) || currQuestionIndex >= questions.size())
            return null;
        Question q = questions.get(currQuestionIndex);

        ++currQuestionIndex;
        if (currQuestionIndex >= questions.size()) currQuestionIndex = 0;

        return q;
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
