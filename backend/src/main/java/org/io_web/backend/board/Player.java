package org.io_web.backend.board;

import lombok.Getter;

/**
 * Probably will be needed for UI purposes as well as keeping position of the player
 */
public class Player {
    @Getter
    private int position;
    private int correctAnswers;

    @Getter
    private String id;
    @Getter
    private String nickname;

    public Player(int position, int correctAnswers, String id, String nickname) {
        this.position = position;
        this.correctAnswers = correctAnswers;
        this.id = id;
        this.nickname = nickname;
    }

    public void addPoints(int points) {
        correctAnswers += points;
    }

    public void move(int steps) {
        position += steps;
    }

    @Override
    public int hashCode() {
        return this.id.hashCode();
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Player other = (Player) obj;

        return this.id.equals(other.id);
    }
}
