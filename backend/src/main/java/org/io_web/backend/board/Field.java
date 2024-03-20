package org.io_web.backend.board;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

/**
 * Class for specify each field
 */
@Setter
@Getter
public class Field {
    private boolean special;
    public Field(boolean special) {
        this.special = special;
    }

}
