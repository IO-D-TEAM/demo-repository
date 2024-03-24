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
    private int id;

    public Player(int position, int correctAnswers, int id) {
        this.position = position;
        this.correctAnswers = correctAnswers;
        this.id = id;
    }

    void move(int steps) {
        position += steps;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(this.id);
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

        return this.id == other.id;
    }
}
