package org.io_web.backend.utilities;

import java.util.Random;

public class GameCodeGenerator {
    /**
     * Returns generated game code
     *
     * @return - Generated code
     */
    public static String generate() {
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder();

        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int CODE_LENGTH = 6;

        for (int i = 0; i < CODE_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            stringBuilder.append(CHARACTERS.charAt(randomIndex));
        }

        return stringBuilder.toString();
    }

}
