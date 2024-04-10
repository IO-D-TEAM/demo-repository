package org.io_web.backend.server;

public enum ClientStatus {
    CONNECTED,          // Connected and playing
    LOST_CONNECTION,    // Lost connection after starting the game, still can come back
    SPECTATOR           // Joined when game was already started, waiting for next round
}
