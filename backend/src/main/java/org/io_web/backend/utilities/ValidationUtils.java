package org.io_web.backend.utilities;

import java.util.Objects;
import java.util.Optional;

import org.io_web.backend.entities.Client;
import org.io_web.backend.exceptions.*;
import org.springframework.stereotype.Service;

@Service
public class ValidationUtils {

    public ValidationUtils() {
    }

    public static void validatePlayerTurn(String clientID, String currentMovingPlayerId) {
        if (!clientID.equals(currentMovingPlayerId)) {
            throw new NotYourTurnException("Not your turn");
        }
    }

    public static void validateGame(String gameCode, String validCode) {
        if (!gameCode.equals(validCode)) {
            throw new GameNotFoundException("Game not found");
        }
    }

    public static void validateNotNull(Optional<Client> client) {
        if (client.isEmpty()) {
            throw new PlayerNotFoundException("Client do not exist");
        }
    }

    public static void validateIfUniquePlayer(Optional<Client> client) {
        if (client.isPresent()) {
            throw new PlayerWithThisIdExistsException("Player with that id already exists: " + client.get().getId());
        }
    }

    public static void validateNextMovingPlayer(String clientId) {
        if (Objects.equals(clientId, "")) {
            throw new NextMoveNotFoundException("Could not process next move");
        }
    }


}

