package board;

import java.util.Set;

/**
 * Class for specify each field
 */
public class Field {
    private final boolean special;
    private Set<Player> players;
    public Field(boolean special) {
        this.special = special;
        this.players = Set.of();
    }

    boolean isSpecial() {
        return special;
    }

    void addPlayer(Player player) {
        players.add(player);
    }

    void removePlayer(Player player) {
        players.remove(player);
    }
}
