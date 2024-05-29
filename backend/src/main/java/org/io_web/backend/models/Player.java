package org.io_web.backend.models;

import java.io.Serializable;

import lombok.Getter;

/**
 * Probably will be needed for UI purposes as well as keeping position of the player
 */
@Getter
public class Player implements Serializable {
    private int position;
    private final String id;
    private final String nickname;
    private final String color;

    public Player(int position, Long id, String nickname, String color) {
        this.position = position;
        this.id = String.valueOf(id);
        this.nickname = nickname;
        this.color = color;
    }

    public void addPoints(int points) {
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

    @Override
    public String toString() {
        return "Player{" +
                "position=" + position +
                ", id='" + id + '\'' +
                ", nickname='" + nickname + '\'' +
                ", color='" + color + '\'' +
                '}';
    }
}
