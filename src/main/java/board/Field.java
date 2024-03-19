package board;

import java.util.Set;

/**
 * Class for specify each field
 */
public class Field {
    private final boolean special;
    public Field(boolean special) {
        this.special = special;
    }

    boolean isSpecial() {
        return special;
    }
}
