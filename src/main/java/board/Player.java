package board;

/**
 * Probably will be needed for UI purposes as well as keeping position of the player
 */
public class Player {
    private int position;
    private int correctAnswers;
    private String nickname;

    public Player(int position, int correctAnswers, String nickname) {
        this.position = position;
        this.correctAnswers = correctAnswers;
        this.nickname = nickname;
    }

    void move(int steps) {
        position += steps;
    }

    public int getPosition() {
        return position;
    }

    @Override
    public int hashCode() {
        return nickname.hashCode();
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final Player other = (Player) obj;

        return this.nickname.equals(other.nickname);
    }
}
